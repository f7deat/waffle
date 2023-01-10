using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Services.AppSettings;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly IAppSettingService _settingService;
        public HeaderViewComponent(IAppSettingService settingService)
        {
            _settingService = settingService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var setting = await _settingService.EnsureSettingAsync(nameof(Header));
            if (string.IsNullOrEmpty(setting.Value))
            {
                return View(Empty.DefaultView);
            }
            return View(JsonSerializer.Deserialize<Header>(setting.Value));
        }
    }
}
