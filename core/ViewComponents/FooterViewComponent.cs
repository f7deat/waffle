using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Models.Settings;

namespace Waffle.ViewComponents;

public class FooterViewComponent(ISettingService settingService, IOptions<SettingOptions> options) : ViewComponent
{
    private readonly ISettingService _settingService = settingService;
    private readonly SettingOptions Options = options.Value;

    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var footer = await _settingService.GetAsync<Footer>(nameof(Footer));
        footer ??= new Footer();
        footer.PageData = PageData;
        return View(Options.Theme, footer);
    }
}
