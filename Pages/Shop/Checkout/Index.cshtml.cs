using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.Pages.Shop.Checkout
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        [BindProperty(SupportsGet = true)]
        public List<Guid> ProductIds { get; set; } = new();

        public List<Catalog> Products { get; set; } = new();

        public async Task OnGetAsync()
        {
            foreach (var productId in ProductIds)
            {
                var product = await _catalogService.FindAsync(productId);
                if (product != null)
                {
                    Products.Add(product);
                }
            }
        }
    }
}
