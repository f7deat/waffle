using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using Waffle.Core.Constants;
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
        if (!string.IsNullOrWhiteSpace(locale))
        {
            if (!LocaleHelper.IsAvailable(locale))
            {
                locale = "vi-VN";
            }
            await RemoveCacheAsync();
            Response.Cookies.Append(CookieKey.Locale, locale);
            Response.Redirect("/");
            return;
        }
        else
        {
            Request.Cookies.TryGetValue(CookieKey.Locale, out string? cookieValue);
            locale = cookieValue ?? "vi-VN";
        }
        PageData = await _catalogService.GetEntryPageDataAsync(page.ToLower());
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
