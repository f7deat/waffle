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
            Catalog = await _catalogService.GetByNameAsync(normalizedName) ?? new();
            if (string.IsNullOrEmpty(Catalog.NormalizedName))
            {
                return NotFound();
            }

            ViewData["Title"] = Catalog.Name;
            ViewData["Description"] = Catalog.Description;
            ViewData["Image"] = Catalog.Thumbnail;
            Components = await _catalogService.ListComponentAsync(Catalog.Id);

            return Page();
        }
    }
}
