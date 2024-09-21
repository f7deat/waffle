using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using System.Globalization;
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
        if (!string.IsNullOrWhiteSpace(locale))
        {
            if (!CultureInfo.GetCultures(CultureTypes.AllCultures).Any(x => x.Name == locale) && locale != "zh-CN")
            {
                locale = "vi-VN";
            }
            await RemoveCacheAsync();
        }
        else
        {
            locale = "vi-VN";
        }
        PageData = await _catalogService.GetEntryPageDataAsync(page.ToLower(), locale);
        ViewData["Title"] = PageData.Name;
        ViewData["Description"] = PageData.Description;
        ViewData["Image"] = PageData.Thumbnail;
        RouteData.Values.TryAdd(nameof(PageData), PageData);
        await base.OnPageHandlerExecutionAsync(context, next);
    }

    private async Task RemoveCacheAsync()
    {
        var memoryCache = HttpContext.RequestServices.GetService<IMemoryCache>();
        if (memoryCache is null) return;

        var localizationService = HttpContext.RequestServices.GetService<ILocalizationService>();
        if (localizationService is null) return;

        var cacheItems = await localizationService.GetAllCacheAsync();
        foreach (var item in cacheItems)
        {
            memoryCache.Remove(item);
        }
    }
}
