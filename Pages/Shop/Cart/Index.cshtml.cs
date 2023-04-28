using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Shop.Cart
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        [BindProperty(SupportsGet = true)]
        public Guid ProductId { get; set; }

        public Catalog Product = new();

        public async Task OnGetAsync()
        {
            Product = await _catalogService.FindAsync(ProductId) ?? new();
        }

        public IActionResult OnPost()
        {
            return Redirect($"/shop/checkout?productIds={ProductId}");
        }
    }
}
