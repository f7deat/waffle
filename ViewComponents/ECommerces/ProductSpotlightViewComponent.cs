using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.ECommerces;

public class ProductSpotlightViewComponent : ViewComponent
{
    private readonly IProductService _productService;
    public ProductSpotlightViewComponent(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        return View(new ProductSpotlight
        {
            Products = await _productService.ListSpotlightAsync(2)
        });
    }
}
