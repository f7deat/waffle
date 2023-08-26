using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Leaf
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public ListResult<Catalog> Catalogs = new();

        public async Task<IActionResult> OnGetAsync()
        {
            Catalogs = await _catalogService.ListAsync(new()
            {
                Type = CatalogType.Default,
                Active = true,
                PageSize = 20
            });
            return Page();
        }
    }
}
