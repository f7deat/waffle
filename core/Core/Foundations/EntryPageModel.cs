using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Foundations;

public class EntryPageModel : PageModel
{
    protected readonly ICatalogService _catalogService;
    public EntryPageModel(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    public PageData PageData { private set; get; } = new();
    [BindProperty(SupportsGet = true)]
    public string Locale { get; set; } = "vi-VN";

    public override async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        var page = context.RouteData.Values["page"]?.ToString();
        if (string.IsNullOrEmpty(page)) return;
        PageData = await _catalogService.GetEntryPageDataAsync(page.ToLower(), Locale);
        ViewData["Title"] = PageData.Name;
        ViewData["Description"] = PageData.Description;
        ViewData["Image"] = PageData.Thumbnail;
        RouteData.Values.TryAdd(nameof(PageData), PageData);
        await base.OnPageHandlerExecutionAsync(context, next);
    }
}
