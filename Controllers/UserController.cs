﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Googles;
using Waffle.Models;

namespace Waffle.Controllers;

public class UserController : BaseController
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<UserController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UserController(IWebHostEnvironment webHostEnvironment, IUserService userService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ILogger<UserController> logger, IConfiguration configuration, RoleManager<ApplicationRole> roleManager)
    {
        _userService = userService;
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _configuration = configuration;
        _roleManager = roleManager;
        _webHostEnvironment = webHostEnvironment;
    }

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
        var user = await _userService.GetCurrentUserAsync(id);
        if (user is null) return BadRequest("User not found!");
        return Ok(user);
    }

    [HttpGet]
    public async Task<IActionResult> GetCurrentUserAsync() => Ok(await _userService.GetCurrentUserAsync(User.GetId()));

    [HttpGet("users-in-role/{roleName}")]
    public async Task<IActionResult> GetUsersInRoleAsync([FromRoute] string roleName) => Ok(await _userService.GetUsersInRoleAsync(roleName));

    [HttpPost("add-to-role"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> AddToRoleAsync([FromBody] AddToRoleModel model) => Ok(await _userService.AddToRoleAsync(model));

    [HttpPost("remove-from-role")]
    public async Task<IActionResult> RemoveFromRoleAsync([FromBody] RemoveFromRoleModel args) => Ok(await _userService.RemoveFromRoleAsync(args));

    [HttpPost("password-sign-in"), AllowAnonymous]
    public async Task<IActionResult> PasswordSignInAsync([FromBody] LoginModel login)
    {
        var result = await _signInManager.PasswordSignInAsync(login.UserName, login.Password, false, false);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByEmailAsync(login.UserName);
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.String),
                new Claim(ClaimTypes.Name, user.UserName, ClaimValueTypes.String),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole, ClaimValueTypes.String));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

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

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserModel model) => Ok(await _userService.CreateAsync(model));

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model) => Ok(await _userService.ChangePasswordAsync(model));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return BadRequest("User not found!");
        return Ok(await _userManager.DeleteAsync(user));
    }

    [HttpGet("initial"), AllowAnonymous]
    public async Task<IActionResult> InitialAsync()
    {
        if (await _userManager.Users.AnyAsync())
        {
            return Ok(IdentityResult.Failed(new IdentityError
            {
                Description = "Initialized"
            }));
        }

        await _roleManager.CreateAsync(new ApplicationRole
        {
            Name = "admin"
        });
        var user = new ApplicationUser
        {
            Email = "f7deat@gmail.com",
            UserName = "f7deat@gmail.com",
            EmailConfirmed = true,
        };
        var result = await _userManager.CreateAsync(user, "Password@123");
        if (!result.Succeeded)
        {
            return Ok(result);
        }
        await _userManager.AddToRoleAsync(user, "admin");
        return Ok(IdentityResult.Success);
    }


    [HttpPost("google-signin"), AllowAnonymous]
    public async Task<IActionResult> GoogleSignUpAsync([FromForm] string? credential)
    {
        var userCredential = await GoogleApiHelper.GetUserCredential(credential);
        if (userCredential is null) return Redirect("/leaf/signin-failed");

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
                return Redirect("/leaf/signin-failed");
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

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

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
}
