using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;

namespace Waffle.Core.Services.AppSettings
{
    public interface IAppSettingService
    {
        Task<AppSetting> EnsureSettingAsync(string name);
        Task<IdentityResult> SaveTelegramAsync(Telegram model);
    }
}
