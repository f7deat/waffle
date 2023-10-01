using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.Models;
using System.Diagnostics;

namespace Waffle.ViewComponents.ECommerces;

public class ProductSpotlightViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    public ProductSpotlightViewComponent(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var products = await _catalogService.ListSpotlightAsync(CatalogType.Product, 2);
        if (!products.Any())
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
        return View(new ProductSpotlight
        {
            Products = products
        });
    }
}
