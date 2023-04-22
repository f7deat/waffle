using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Core.Foundations
{
    public class EntryPageModel : PageModel
    {
        protected readonly ICatalogService _catalogService;
        public EntryPageModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog PageData { private set; get; } = new();

        public override async Task OnPageHandlerSelectionAsync(PageHandlerSelectedContext context)
        {
            var page = context.RouteData.Values["page"]?.ToString();
            if (string.IsNullOrEmpty(page))
            {
                return;
            }
            var catalog = await _catalogService.EnsureDataAsync(page.ToLower(), CatalogType.Entry);
            PageData = catalog;
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;
            RouteData.Values.TryAdd(nameof(Catalog), catalog);
        }
    }
}
