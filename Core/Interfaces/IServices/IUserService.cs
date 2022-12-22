using Microsoft.AspNetCore.Identity;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IServices
{
    public interface IUserService
    {
        Task<IdentityResult> CreateAsync(CreateUserModel model);
        Task<IdentityResult> ChangePasswordAsync(ChangePasswordModel model);
        Task<dynamic> GetCurrentUserAsync(string id);
    }
}
