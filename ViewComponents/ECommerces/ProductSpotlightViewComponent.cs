using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.ECommerces;

public class ProductSpotlightViewComponent : ViewComponent
{
    private readonly IProductService _productService;
    private readonly IWorkService _workService;
    public ProductSpotlightViewComponent(IProductService productService, IWorkService workService)
    {
        _productService = productService;
        _workService = workService;
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid? workId)
    {
        var work = await _workService.GetAsync<ProductSpotlight>(workId);
        if (work is null)
        {
            work ??= new ProductSpotlight();
            work.Products = await _productService.ListSpotlightAsync(4);
        }
        else
        {
            work.Products = await _productService.ListSpotlightAsync(work.PageSize);
        }
        return View(work);
    }
}
