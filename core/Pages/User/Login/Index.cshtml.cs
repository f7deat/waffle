using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.User.Login;

public class IndexModel(ISettingService _appSettingService, SignInManager<ApplicationUser> _signInManager, UserManager<ApplicationUser> _userManager, IConfiguration _configuration, ICatalogService catalogService) : EntryPageModel(catalogService)
{
    [BindProperty(SupportsGet = true)]
    public string? UserName { get; set; }
    [BindProperty(SupportsGet = true)]
    public string? Password { get; set; }

    public Microsoft.AspNetCore.Identity.SignInResult? SignInResult;
    public ExternalAPI.GoogleAggregate.Google? Google;

    public async Task OnGetAsync()
    {
        Google = await _appSettingService.GetAsync<ExternalAPI.GoogleAggregate.Google>(nameof(Google));
    }

    public async Task<IActionResult> OnPostAsync(string? returnUrl)
    {
        returnUrl ??= Url.Content("~/");

        if (string.IsNullOrEmpty(UserName) || string.IsNullOrEmpty(Password)) return Page();
        SignInResult = await _signInManager.PasswordSignInAsync(UserName, Password, false, false);
        if (SignInResult.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(UserName);
            if (user is null) return Unauthorized();
            var userRoles = await _userManager.GetRolesAsync(user);
            if (string.IsNullOrEmpty(user.UserName)) return BadRequest();
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.String),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName, ClaimValueTypes.String),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole, ClaimValueTypes.String));
            }
            var jwtSecret = _configuration["JWT:Secret"];
            if (string.IsNullOrEmpty(jwtSecret)) return BadRequest();
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

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

            return LocalRedirect(returnUrl);
        }
        return Page();
    }
}
