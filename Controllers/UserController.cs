using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Waffle.Core.Interfaces.IServices;
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
        private readonly IUserService _userService;
        public UserController(IUserService userService, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ILogger<UserController> logger, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
            _roleManager = roleManager;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest();
            }
            var query = _userManager.Users.Where(x => x.Id != currentUserId).OrderByDescending(x => x.Id);
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> FindByIdAsync([FromRoute] string id) => Ok(await _userService.GetCurrentUserAsync(id));

        [HttpGet("")]
        public async Task<IActionResult> GetUserAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(IdentityResult.Failed());
            }
            return Ok(new
            {
                succeeded = true,
                data = await _userService.GetCurrentUserAsync(userId)
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

        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync([FromBody] CreateUserModel model) => Ok(await _userService.CreateAsync(model));

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model) => Ok(await _userService.ChangePasswordAsync(model));

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
