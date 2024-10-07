using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.ECommerces;

public class ProductSpotlightViewComponent : ViewComponent
{
    private readonly IProductService _productService;
    private readonly IWorkService _workService;
    private readonly ICatalogService _catalogService;
    private readonly ILocalizationService _localizationService;

    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public ProductSpotlightViewComponent(IProductService productService, IWorkService workService, ICatalogService catalogService, ILocalizationService localizationService)
    {
        _productService = productService;
        _workService = workService;
        _catalogService = catalogService;
        _localizationService = localizationService;
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid? workId)
    {
        var work = await _workService.GetAsync<ProductSpotlight>(workId);
        var tagIds = await _catalogService.ListTagIdsAsync(PageData.Id);
        if (work is null)
        {
            work ??= new ProductSpotlight();
            work.Products = await _productService.ListSpotlightAsync(4, tagIds, PageData.Locale ?? "vi-VN");
        }
        else
        {
            work.Products = await _productService.ListSpotlightAsync(work.PageSize, tagIds, PageData.Locale ?? "vi-VN");
        }
        work.Title = await _localizationService.GetAsync("ProductSpotlightTitle", PageData.Locale);
        work.PageData = PageData;
        return View(work);
    }
}
