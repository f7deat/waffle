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
        private readonly IConfiguration _configuration;
        public FooterViewComponent(IAppSettingService settingService, IConfiguration configuration)
        {
            _settingService = settingService;
            _configuration = configuration;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var footer = await _settingService.GetAsync<Footer>(nameof(Footer));
            if (footer is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = string.Empty
                });
            }
            var social = await _settingService.GetAsync<Social>(nameof(Social));
            if (social != null)
            {
                footer.Social = social;
            }
            return View(footer);
        }
    }
}
