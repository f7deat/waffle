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

    public PageData PageData { protected set; get; } = new();
    public PageData? CategoryData { private set; get; }

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
                CategoryData = await _catalogService.GetPageDataAsync(category?.ToString());
                RouteData.Values.TryAdd(nameof(CategoryData), CategoryData);
                if (CategoryData != null && CatalogType.WordPress == CategoryData.Type)
                {
                    PageData = new PageData
                    {
                        NormalizedName = nornamlizedName,
                        Type = CatalogType.WordPress
                    };
                    RouteData.Values.TryAdd(nameof(PageData), PageData);
                    return;
                }
            }
        }
        var pageData = await _catalogService.GetPageDataAsync(nornamlizedName);
        if (pageData is null)
        {
            context.HttpContext.Response.StatusCode = 404;
            context.HttpContext.Response.Redirect("/exception/notfound");
            return;
        }
        PageData = pageData;
        ViewData["Title"] = PageData.Name;
        ViewData["Description"] = PageData.Description;
        ViewData["Image"] = PageData.Thumbnail;
        RouteData.Values.TryAdd(nameof(PageData), PageData);
    }
}
