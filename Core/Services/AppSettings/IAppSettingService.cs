using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Core.Services.AppSettings
{
    public interface IAppSettingService
    {
        Task<AppSetting> EnsureSettingAsync(string name);
        Task<ListResult<AppSetting>> ListAsync();
        Task<IdentityResult> SaveTelegramAsync(Telegram model);
    }
}
