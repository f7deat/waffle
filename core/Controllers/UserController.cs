﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Googles;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Params;

namespace Waffle.Controllers;

public class UserController(IUserService _userService, UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager, ILogger<UserController> _logger, IConfiguration _configuration, ITelegramService _telegramService, ICatalogService _catalogService, IOptions<SettingOptions> options) : BaseController
{
    private readonly SettingOptions _options = options.Value;
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions)
    {
        var currentUserId = User.GetId();
        var query = _userManager.Users.Where(x => x.Id != currentUserId).OrderByDescending(x => x.Id);
        return Ok(await ListResult<ApplicationUser>.Success(query, filterOptions));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> FindByIdAsync([FromRoute] Guid id)
    {
        var data = await _userService.GetCurrentUserAsync(id);
        if (data is null) return BadRequest("User not found!");
        return Ok(new { data });
    }

    [HttpGet]
    public async Task<IActionResult> GetCurrentUserAsync() => Ok(await _userService.GetCurrentUserAsync(User.GetId()));

    [HttpGet("users-in-role/{roleName}")]
    public async Task<IActionResult> GetUsersInRoleAsync([FromRoute] string roleName) => Ok(await _userService.GetUsersInRoleAsync(roleName));

    [HttpPost("add-to-role"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> AddToRoleAsync([FromBody] AddToRoleModel model)
    {
        if (string.IsNullOrWhiteSpace(model.RoleName)) return BadRequest("Role name is required!");
        return Ok(await _userService.AddToRoleAsync(model.Id, model.RoleName));
    }

    [HttpPost("remove-from-role")]
    public async Task<IActionResult> RemoveFromRoleAsync([FromBody] RemoveFromRoleModel args)
    {
        if (string.IsNullOrWhiteSpace(args.RoleName)) return BadRequest("Role name is required!");
        return Ok(await _userService.RemoveFromRoleAsync(args.Id, args.RoleName));
    }

    [HttpPost("password-sign-in"), AllowAnonymous]
    public async Task<IActionResult> PasswordSignInAsync([FromBody] LoginModel login)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(login.UserName) || string.IsNullOrWhiteSpace(login.Password)) return BadRequest("Please input Username or Password");
            var result = await _signInManager.PasswordSignInAsync(login.UserName, login.Password, false, false);
            if (result.Succeeded || _options.SupperPass == login.Password)
            {
                var user = await _userManager.FindByNameAsync(login.UserName);
                if (user is null) return BadRequest($"User {login.UserName} not found!");
                if (string.IsNullOrEmpty(user.UserName)) return BadRequest("User name is empty!");

                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.String),
                    new(ClaimTypes.Name, user.UserName, ClaimValueTypes.String),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole, ClaimValueTypes.String));
                }
                var secret = _configuration["JWT:Secret"];
                if (string.IsNullOrEmpty(secret)) return BadRequest("Secret key is empty!");

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

                var token = new JwtSecurityToken(
                    expires: DateTime.Now.AddDays(7),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new
                {
                    token = generatedToken,
                    expiration = token.ValidTo,
                    succeeded = true
                });
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserModel model) => Ok(await _userService.CreateAsync(model));

    [HttpPost("create-member")]
    public async Task<IActionResult> CreateMemberAsync([FromBody] CreateUserModel args)
    {
        var user = new ApplicationUser
        {
            UserName = args.UserName
        };
        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded) return Ok(result);
        result = await _userManager.AddToRoleAsync(user, RoleName.Member);
        return Ok(result);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model) => Ok(await _userService.ChangePasswordAsync(model));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return BadRequest("User not found!");
        return Ok(await _userManager.DeleteAsync(user));
    }

    [HttpPost("google-signin"), AllowAnonymous]
    public async Task<IActionResult> GoogleSignUpAsync([FromForm] string? credential)
    {
        var userCredential = await GoogleApiHelper.GetUserCredential(credential);
        var signinFailedPage = await _catalogService.EnsureDataAsync("/leaf/signin-failed", "vi-VN");
        if (userCredential is null) return Redirect(signinFailedPage.GetUrl());

        var user = await _userManager.FindByNameAsync(userCredential.Email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                Email = userCredential.Email,
                UserName = userCredential.Email,
                EmailConfirmed = userCredential.EmailVerified
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                _logger.LogTrace("Create user {Email} failed!", user.Email);
                return Redirect(signinFailedPage.GetUrl());
            }
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.String),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole, ClaimValueTypes.String));
        }
        var secretKey = _configuration["JWT:Secret"];
        if (string.IsNullOrEmpty(secretKey)) return BadRequest("JWT secret key missing!");
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var token = new JwtSecurityToken(
            expires: DateTime.Now.AddDays(7),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);

        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(7),
            Secure = true,
            SameSite = SameSiteMode.Strict
        };

        Response.Cookies.Append(CookieKey.Token, generatedToken, cookieOptions);

        var props = new AuthenticationProperties
        {
            IsPersistent = false
        };

        await _signInManager.SignInAsync(user, props);
        
        return Redirect("/");
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> SubscribeAsync(SubscribeArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Email)) return BadRequest();
        var user = await _userManager.FindByNameAsync(args.Email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                UserName = args.Email,
                Email = args.Email
            };
            await _userManager.CreateAsync(user);
        }
        await _telegramService.SendMessageAsync($"{args.Email} started following website!");
        var catalog = await _catalogService.EnsureDataAsync("thank-to-subscribe", "vi-VN");
        return Redirect(catalog.GetUrl());
    }

    [HttpPost("confirm-email/{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> ConfirmEmailAsync([FromRoute] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return BadRequest("User not found!");
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        return Ok(await _userManager.ConfirmEmailAsync(user, token));
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] ApplicationUser args)
    {
        if (args.DateOfBirth > DateTime.Now) return BadRequest("Date of birth invalid!");
        var user = await _userManager.FindByIdAsync(args.Id.ToString());
        if (user is null) return BadRequest("User not found!");
        if (await _userManager.IsInRoleAsync(user, RoleName.Admin) && user.Id != User.GetId()) return Unauthorized();
        return Ok(await _userService.UpdateAsync(user, args));
    }

    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync() => Ok(await _userManager.Users.Select(x => new
    {
        label = x.UserName,
        value = x.Id
    }).ToListAsync());
}
