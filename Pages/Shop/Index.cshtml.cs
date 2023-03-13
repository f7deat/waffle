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
            Products = new List<Catalog>();
        }

        public IEnumerable<Catalog> Products;
        public Catalog Shop;

        public async Task<IActionResult> OnGetAsync()
        {
            Shop = await _catalogService.EnsureDataAsync(nameof(Shop), CatalogType.Entry);
            ViewData["Title"] = Shop.Name; 
            ViewData["Description"] = Shop.Description;

            var catalog = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Shop
            });
            Products = catalog.Data ?? new List<Catalog>();
            return Page();
        }
    }
}
