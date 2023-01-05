using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class FooterViewComponent : ViewComponent
    {
        private readonly IAppSettingService _appService;
        public FooterViewComponent(IAppSettingService appService)
        {
            _appService = appService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var setting = await _appService.EnsureSettingAsync(nameof(Footer));
            if (string.IsNullOrEmpty(setting?.Value))
            {
                return View("~/Views/Shared/Components/Empty/Default.cshtml");
            }
            return View(JsonSerializer.Deserialize<Footer>(setting.Value));
        }
    }
}
