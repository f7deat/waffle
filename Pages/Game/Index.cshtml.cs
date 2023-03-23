using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Game
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog Catalog = new();
        public IEnumerable<ComponentListItem> Components = new List<ComponentListItem>();

        public async Task OnGetAsync()
        {
            Catalog = await _catalogService.EnsureDataAsync(nameof(Game), CatalogType.Entry);
            Components = await _catalogService.ListComponentAsync(Catalog.Id);
        }
    }
}
