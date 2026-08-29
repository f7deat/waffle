using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Settings.Args;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface ISettingService
{
    Task<TResult> DeleteAsync(Guid id);
    Task<AppSetting> EnsureSettingAsync(string name);
    Task<object> GetAsync(Guid id);
    Task<T?> GetAsync<T>(string normalizedName, string locale = "vi-VN");
    Task<TResult> InitAsync();
    Task<ListResult<AppSetting>> ListAsync(SearchFilterOptions filterOptions);
    Task<TResult> SaveAsync(SettingUpdateArgs args);
    Task<IdentityResult> SaveAsync(string normalizedName, object args);
    Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram model);
}
