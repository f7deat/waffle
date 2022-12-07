using Waffle.Entities;

namespace Waffle.Core.Services.AppSettings
{
    public interface IAppSettingService
    {
        Task<AppSetting> EnsureSettingAsync(string name);
    }
}
