using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService
{
    public interface IUserService
    {
        Task<IdentityResult> CreateAsync(CreateUserModel model);
        Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel model);
        Task<dynamic> GetCurrentUserAsync(string id);
        Task<IdentityResult> AddToRoleAsync(AddToRoleModel model);
        Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName);
        Task<IdentityResult> RemoveFromRoleAsync(RemoveFromRoleModel args);
    }
}
