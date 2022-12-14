using Microsoft.AspNetCore.Identity;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IdentityResult> AddToRoleAsync(AddToRoleModel model)
        {
            if (string.IsNullOrEmpty(model.UserId) || string.IsNullOrEmpty(model.RoleName))
            {
                return IdentityResult.Failed();
            }
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "User not found!"
                });
            }
            if (!await _roleManager.RoleExistsAsync(model.RoleName))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Role not found!"
                });
            }
            return await _userManager.AddToRoleAsync(user, model.RoleName);
        }

        public async Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "User not found!"
                });
            }
            return await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        }

        public async Task<IdentityResult> CreateAsync(CreateUserModel model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return IdentityResult.Failed();
            }
            var user = new IdentityUser
            {
                Email = model.Email,
                UserName = model.Email
            };
            return await _userManager.CreateAsync(user, model.Password);
        }

        public async Task<dynamic> GetCurrentUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var roles = await _userManager.GetRolesAsync(user);
            return new
            {
                user.Id,
                user.Email,
                user.PhoneNumber,
                user.UserName,
                avatar = $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(user.Email)}?s=520",
                roles
            };
        }
    }
}
