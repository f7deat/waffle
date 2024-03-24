using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Extensions;
using Waffle.Models.Settings;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;

namespace Waffle.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    private readonly ISettingService _settingService;
    private readonly IConfiguration _configuration;
    private readonly SettingOptions Options;

    public HeaderViewComponent(ISettingService settingService, IConfiguration configuration, IOptions<SettingOptions> options)
    {
        _settingService = settingService;
        _configuration = configuration;
        Options = options.Value;
    }

    protected Catalog PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(Catalog), out var values);
            return values as Catalog ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var header = await _settingService.GetAsync<Header>(nameof(Header));
        header ??= new Header();
        header.IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
        header.UserId = UserClaimsPrincipal.GetId();
        header.Catalog = PageData;
        return View(Options.Theme, header);
    }
}
