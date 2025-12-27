using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.Interfaces.IService;

public interface IUserService
{
    Task<IdentityResult> CreateAsync(CreateUserModel model);
    Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel model);
    Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid id);
    Task<IdentityResult> AddToRoleAsync(Guid userId, string roleName);
    Task<dynamic> GetUsersInRoleAsync(string roleName);
    Task<IdentityResult> RemoveFromRoleAsync(Guid userId, string roleName);
    Task<ListResult<Contact>> ListContactAsync(SearchFilterOptions filterOptions);
    Task<IdentityResult> UpdateAsync(ApplicationUser user, ApplicationUser args);
    Task<ListResult> GetInfluencersAsync(FilterOptions filterOptions);
}
