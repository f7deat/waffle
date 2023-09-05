using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    private readonly IAppSettingService _settingService;
    private readonly IConfiguration _configuration;

    public HeaderViewComponent(IAppSettingService settingService, IConfiguration configuration)
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
        var setting = await _settingService.EnsureSettingAsync(nameof(Header));
        if (string.IsNullOrEmpty(setting.Value))
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = setting.Id.ToString()
            });
        }
        var header = JsonSerializer.Deserialize<Header>(setting.Value);
        if (header is null)
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = setting.Id.ToString()
            });
        }
        header.IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
        header.Catalog = PageData;
        return View(_configuration.GetValue<string>("Theme"), header);
    }
}
