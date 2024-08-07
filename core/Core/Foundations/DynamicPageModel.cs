using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Foundations;

public abstract class DynamicPageModel : PageModel
{
    protected readonly ICatalogService _catalogService;
    public DynamicPageModel(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    public Catalog PageData { protected set; get; } = new();
    public Catalog? Category { private set; get; }

    public override async Task OnPageHandlerSelectionAsync(PageHandlerSelectedContext context)
    {
        context.RouteData.Values.TryGetValue("category", out var _category);
        context.RouteData.Values.TryGetValue("normalizedName", out var _normalizedName);
        var category = _category?.ToString();
        var nornamlizedName = _normalizedName?.ToString();
        if (string.IsNullOrEmpty(nornamlizedName))
        {
            nornamlizedName = category;
        }
        else
        {
            if (!string.IsNullOrEmpty(category?.ToString()))
            {
                Category = await _catalogService.GetByNameAsync(category?.ToString());
                RouteData.Values.TryAdd("Parent", Category);
                if (Category != null && CatalogType.WordPress == Category.Type)
                {
                    PageData = new Catalog
                    {
                        NormalizedName = nornamlizedName,
                        Type = CatalogType.WordPress
                    };
                    RouteData.Values.TryAdd(nameof(Catalog), PageData);
                    return;
                }
            }
        }
        var catalog = await _catalogService.GetByNameAsync(nornamlizedName);
        if (catalog is null)
        {
            context.HttpContext.Response.StatusCode = 404;
            context.HttpContext.Response.Redirect("/exception/notfound");
            return;
        }
        PageData = catalog;
        ViewData["Title"] = catalog.Name;
        ViewData["Description"] = catalog.Description;
        ViewData["Image"] = catalog.Thumbnail;
        RouteData.Values.TryAdd(nameof(Catalog), PageData);
    }
}
