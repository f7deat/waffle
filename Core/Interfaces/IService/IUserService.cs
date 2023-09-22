using Microsoft.AspNetCore.Identity;
using Waffle.Models;
using Waffle.Models.ViewModels;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.Interfaces.IService;

public interface IUserService
{
    Task<IdentityResult> CreateAsync(CreateUserModel model);
    Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel model);
    Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid id);
    Task<IdentityResult> AddToRoleAsync(AddToRoleModel model);
    Task<dynamic> GetUsersInRoleAsync(string roleName);
    Task<IdentityResult> RemoveFromRoleAsync(RemoveFromRoleModel args);
    Task<ListResult<UserViewModel>> ListContactAsync(SearchFilterOptions filterOptions);
}
