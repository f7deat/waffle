using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;

namespace Waffle.Core.Foundations;

public class EntryPageModel : PageModel
{
    protected readonly ICatalogService _catalogService;

    public EntryPageModel(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    public PageData PageData { private set; get; } = new();

    public override async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        var page = context.RouteData.Values["page"]?.ToString();
        if (string.IsNullOrEmpty(page)) return;
        context.HttpContext.Request.Query.TryGetValue("locale", out var locale);
        if (!LocaleHelper.IsAvailable(locale))
        {
            locale = "vi-VN";
        }
        page = $"{page}.{locale}";
        PageData = await _catalogService.GetEntryPageDataAsync(page);
        ViewData["Title"] = PageData.Name;
        ViewData["Description"] = PageData.Description;
        ViewData["Image"] = PageData.Thumbnail;
        RouteData.Values.TryAdd(nameof(PageData), PageData);
        await base.OnPageHandlerExecutionAsync(context, next);
    }
}
