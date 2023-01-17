using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Services.AppSettings;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class FooterViewComponent : ViewComponent
    {
        private readonly IAppSettingService _settingService;
        public FooterViewComponent(IAppSettingService settingService)
        {
            _settingService = settingService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var setting = await _settingService.EnsureSettingAsync(nameof(Footer));
            if (string.IsNullOrEmpty(setting.Value))
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = setting.Id.ToString()
                });
            }
            return View(JsonSerializer.Deserialize<Footer>(setting.Value));
        }
    }
}
