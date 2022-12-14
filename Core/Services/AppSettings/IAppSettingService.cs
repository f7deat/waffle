using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Services.AppSettings
{
    public interface IAppSettingService
    {
        Task<AppSetting> EnsureSettingAsync(string name);
        Task<Footer?> GetFooterAsync(Guid id);
        Task<Header?> HeaderGetAsync(Guid id);
        Task<IdentityResult> HeaderLogoAsync(Header args);
        Task<IdentityResult> HeaderSaveAsync(Header args);
        Task<ListResult<AppSetting>> ListAsync();
        Task<IdentityResult> SaveFooterAsync(Footer args);
        Task<IdentityResult> SaveTelegramAsync(Telegram model);
    }
}
