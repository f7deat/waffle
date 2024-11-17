using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface ISettingService
{
    Task<AppSetting> EnsureSettingAsync(string name);
    Task<object> GetAsync(Guid id);
    Task<T?> GetAsync<T>(string normalizedName);
    Task<ListResult<AppSetting>> ListAsync(SearchFilterOptions filterOptions);
    Task<IdentityResult> SaveAsync(Guid id, object args);
    Task<IdentityResult> SaveAsync(string normalizedName, object args);
    Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram model);
}
