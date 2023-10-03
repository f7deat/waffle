using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class RelatedViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    public RelatedViewComponent(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    private Catalog PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(Catalog), out var values);
            return values as Catalog ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync(IEnumerable<Guid> tagIds)
    {
        if (!tagIds.Any())
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
        var articles = await _catalogService.ArticleRelatedListAsync(new ArticleRelatedFilterOption
        {
            Current = 1,
            PageSize = 4,
            CatalogId = PageData.Id,
            TagIds = tagIds,
            Type = PageData.Type
        });
        if (articles?.Data == null || !articles.Data.Any())
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
        var view = PageData.Type == CatalogType.Product ? "Product" : "Default";
        return View(view, articles.Data);
    }
}
