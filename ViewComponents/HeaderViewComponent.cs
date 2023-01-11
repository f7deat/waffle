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
            var header = JsonSerializer.Deserialize<Header>(setting.Value);
            if (header is null)
            {
                return View(Empty.DefaultView);
            }
            return View(header.Template, header);
        }
    }
}
