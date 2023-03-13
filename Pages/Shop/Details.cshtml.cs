using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Shop
{
    public class DetailsModel : PageModel
    {
        private readonly ICatalogService _productService;

        public DetailsModel(ICatalogService productService)
        {
            _productService = productService;
            Catalog = new Catalog();
        }

        public Catalog Catalog;

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var catalog = await _productService.GetByNameAsync(normalizedName);
            if (catalog is null)
            {
                return NotFound();
            }
            Catalog = catalog;
            return Page();
        }
    }
}
