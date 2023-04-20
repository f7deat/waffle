using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Foundations
{
    public abstract class DynamicPageModel : PageModel
    {
        protected readonly ICatalogService _catalogService;
        public DynamicPageModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog PageData { private set; get; } = new();

        public override async Task OnPageHandlerSelectionAsync(PageHandlerSelectedContext context)
        {
            context.RouteData.Values.TryGetValue("normalizedName", out var normalizedName);
            var catalog = await _catalogService.GetByNameAsync(normalizedName?.ToString());
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
            RouteData.Values.TryAdd(nameof(Catalog), catalog);
        }
    }
}
