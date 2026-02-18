using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Users;
using Waffle.Entities;
using Waffle.Entities.Users;
using Waffle.Models;
using Waffle.Models.ViewModels.Users;

namespace Waffle.Core.IServices.Users;

public interface IUserService
{
    Task<TResult> CreateAsync(CreateUserModel model);
    Task<TResult> ChangePasswordAsync(ChangePasswordModel model);
    Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid id);
    Task<TResult> AddToRoleAsync(Guid userId, string roleName);
    Task<dynamic> GetUsersInRoleAsync(string roleName);
    Task<TResult> RemoveFromRoleAsync(Guid userId, string roleName);
    Task<ListResult<Contact>> ListContactAsync(SearchFilterOptions filterOptions);
    Task<TResult> UpdateAsync(ApplicationUser user, ApplicationUser args);
    Task<ListResult> GetInfluencersAsync(FilterOptions filterOptions);
    Task<TResult> BecomeInfluencerAsync(BecomeInfluencerArgs args);
    Task<TResult> ChangeAvatarAsync(ChangeAvatarArgs args, string host);
    Task<TResult> GetByUserNameAsync(string userName);
    Task<object?> GetInfluencerOptionsAsync(SelectOptions selectOptions);
}
