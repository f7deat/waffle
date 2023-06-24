using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        public UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<IdentityResult> AddToRoleAsync(AddToRoleModel model)
        {
            if (string.IsNullOrEmpty(model.Id) || string.IsNullOrEmpty(model.RoleName))
            {
                return IdentityResult.Failed();
            }
            var user = await _userManager.FindByIdAsync(model.Id);
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

        public async Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel args)
        {
            var user = await _userManager.FindByIdAsync(args.Id);
            if (user is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "User not found!"
                });
            }
            return await _userManager.ChangePasswordAsync(user, args.CurrentPassword, args.NewPassword);
        }

        public async Task<IdentityResult> CreateAsync(CreateUserModel model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return IdentityResult.Failed();
            }
            var user = new ApplicationUser
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

        public async Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName) => await _userManager.GetUsersInRoleAsync(roleName);

        public async Task<ListResult<UserViewModel>> ListContactAsync(SearchFilterOptions filterOptions)
        {
            var query = from a in _context.Users
                        join b in _context.UserRoles on a.Id equals b.UserId
                        join c in _context.Roles on b.RoleId equals c.Id
                        where c.NormalizedName == _roleManager.NormalizeKey(RoleName.Contact)
                        orderby a.Id descending
                        select new UserViewModel
                        {
                            Id = a.Id,
                            UserName = a.UserName,
                            Email = a.Email
                        };
            return await ListResult<UserViewModel>.Success(query, filterOptions);
        }

        public async Task<IdentityResult> RemoveFromRoleAsync(RemoveFromRoleModel args)
        {
            var user = await _userManager.FindByIdAsync(args.Id);
            if (user is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "User not found!"
                });
            }
            return await _userManager.RemoveFromRoleAsync(user, args.RoleName);
        }
    }
}
