using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.ECommerces;

public class ProductImageViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;

    public ProductImageViewComponent(ICatalogService catalogService)
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

    public async Task<IViewComponentResult> InvokeAsync(Guid workId)
    {
        var work = await _catalogService.GetProductImageAsync(PageData.Id);
        work ??= new ProductImage();
        if (!work.Images.Any(x => x.Equals(PageData.Thumbnail)))
        {
            work.Images.Insert(0, PageData.Thumbnail ?? "/imgs/search-engines-amico.svg");
        }
        return View(work);
    }
}
