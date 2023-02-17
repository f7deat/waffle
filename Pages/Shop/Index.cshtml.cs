using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Shop
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;

        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
            Shop = new Catalog();
        }

        public ListResult<Catalog>? Catalogs;
        public Catalog Shop;

        public async Task<IActionResult> OnGetAsync()
        {
            Shop = await _catalogService.EnsureDataAsync(nameof(Shop), CatalogType.Entry);
            ViewData["Title"] = Shop.Name; 
            ViewData["Description"] = Shop.Description;

            Catalogs = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Shop
            });
            return Page();
        }
    }
}
