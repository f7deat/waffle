using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.ECommerces;

public class ProductImageViewComponent : ViewComponent
{

    private readonly IWorkService _workService;

    public ProductImageViewComponent(IWorkService workService)
    {
        _workService = workService;
    }

    private Catalog PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(Catalog), out var values);
            return values as Catalog ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid workId)
    {
        var work = await _workService.GetAsync<ProductImage>(workId) ?? new();
        work.Images.Insert(0, PageData.Thumbnail ?? "/imgs/search-engines-amico.svg");
        return View(work);
    }
}
