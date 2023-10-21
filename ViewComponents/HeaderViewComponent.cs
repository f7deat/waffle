using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Extensions;
using Waffle.Models.Settings;

namespace Waffle.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    private readonly ISettingService _settingService;
    private readonly IConfiguration _configuration;

    public HeaderViewComponent(ISettingService settingService, IConfiguration configuration)
    {
        _settingService = settingService;
        _configuration = configuration;
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
        return View(header.ViewName, header);
    }
}
