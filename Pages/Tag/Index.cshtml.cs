using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Tag
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog Catalog = new();

        public async Task OnGetAsync()
        {
            Catalog = await _catalogService.EnsureDataAsync(nameof(Tag), CatalogType.Entry);
            ViewData["Title"] = Catalog.Name;
            ViewData["Description"] = Catalog.Description;
        }
    }
}
