using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Shops;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class RelatedViewComponent(ICatalogService catalogService, IProductService productService, ILocalizationService localizationService) : ViewComponent
{
    private readonly ICatalogService _catalogService = catalogService;
    private readonly IProductService _productService = productService;
    private readonly ILocalizationService _localizationService = localizationService;

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
        if (PageData.Type == CatalogType.Product)
        {
            return View("Product", new Feed
            {
                Name = await _localizationService.GetAsync("RelatedProducts"),
                Products = await _productService.ListRelatedAsync(PageData)
            });
        }
        var articles = await _catalogService.ArticleRelatedListAsync(new ArticleRelatedFilterOption
        {
            Current = 1,
            PageSize = 4,
            CatalogId = PageData.Id,
            Type = PageData.Type,
            ParentId = PageData.ParentId
        });
        if (articles?.Data == null || !articles.Data.Any())
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
        return View(articles.Data);
    }
}
