using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Helpers;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;
        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ILogger<UserController> logger, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
            _roleManager = roleManager;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync() => Ok(await _userManager.Users.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> FindByIdAsync([FromRoute] string id) => Ok(await _userManager.FindByIdAsync(id));

        [HttpGet("")]
        public async Task<IActionResult> GetUserAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(IdentityResult.Failed());
            }
            var user = await _userManager.FindByIdAsync(userId);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                succeeded = true,
                data = new
                {
                    user.Id,
                    user.Email,
                    user.PhoneNumber,
                    user.UserName,
                    avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(user.Email)}?s=520",
                    roles
                }
            });
        }

        [HttpPost("password-sign-in"), AllowAnonymous]
        public async Task<IActionResult> PasswordSignInAsync([FromBody] LoginModel login)
        {
            var result = await _signInManager.PasswordSignInAsync(login.UserName, login.Password, false, false);
            if (result.Succeeded)
            {
                _logger.LogInformation("Login", login.UserName);
                var user = await _userManager.FindByEmailAsync(login.UserName);
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

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    succeeded = true
                });
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "User not found!"
                }));
            }
            return Ok(await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword));

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

            await _roleManager.CreateAsync(new IdentityRole
            {
                Name = "admin"
            });
            var user = new IdentityUser
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
    }
}
