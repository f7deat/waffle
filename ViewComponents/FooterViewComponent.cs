using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Settings;

namespace Waffle.ViewComponents;

public class FooterViewComponent : ViewComponent
{
    private readonly ISettingService _settingService;
    public FooterViewComponent(ISettingService settingService)
    {
        _settingService = settingService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var footer = await _settingService.GetAsync<Footer>(nameof(Footer));
        footer ??= new Footer();
        return View(footer.ViewName, footer);
    }
}
