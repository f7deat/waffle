using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;

namespace Waffle.ViewComponents;

public class TagViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    public TagViewComponent(ICatalogService catalogService)
    {
        _catalogService = catalogService;

    }

    private PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        return View(await _catalogService.ListRandomTagAsync(PageData.Locale ?? "vi-VN"));
    }
}
