using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.User
{
    public class LoginModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        public LoginModel(ICatalogService catalogService, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _catalogService = catalogService;
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
        }

        [BindProperty(SupportsGet = true)]
        public string? UserName { get; set; }
        [BindProperty(SupportsGet = true)]
        public string? Password { get; set; }

        public Microsoft.AspNetCore.Identity.SignInResult? SignInResult;

        public async Task OnGetAsync()
        {
            var catalog = await _catalogService.EnsureDataAsync("Login", CatalogType.Entry);
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;
        }

        public async Task<IActionResult> OnPostAsync(string? returnUrl)
        {
            returnUrl ??= Url.Content("~/");

            if (string.IsNullOrEmpty(UserName) || string.IsNullOrEmpty(Password))
            {
                return Page();
            }
            SignInResult = await _signInManager.PasswordSignInAsync(UserName, Password, false, false);
            if (SignInResult.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(UserName);
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id, ClaimValueTypes.String),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole, ClaimValueTypes.String));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    expires: DateTime.Now.AddDays(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                var generatedToken = new JwtSecurityTokenHandler().WriteToken(token);

                HttpContext.Session.SetString("wf_token", generatedToken);

                return LocalRedirect(returnUrl);
            }
            return Page();
        }
    }
}
