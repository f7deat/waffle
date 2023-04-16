using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Video
{
    public class DetailsModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public DetailsModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog Catalog = new();
        public List<ComponentListItem> Components = new();

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var catalog = await _catalogService.GetByNameAsync(normalizedName);
            if (catalog == null)
            {
                return NotFound();
            }
            ViewData["Title"] = catalog.Name;
            ViewData["Description"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;
            Components = await _catalogService.ListComponentAsync(catalog.Id);
            return Page();
        }
    }
}
