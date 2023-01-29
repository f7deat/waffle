using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Pages.Blogspot
{
    public class ListModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public ListModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog? Catalog;
        public IEnumerable<ComponentListItem>? Components;

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return NotFound();
            }
            Catalog = await _catalogService.GetByNameAsync(normalizedName);
            if (Catalog is null)
            {
                return NotFound();
            }
            ViewData["Title"] = Catalog.Name;
            ViewData["Desctiption"] = Catalog.Description;
            Components = await _catalogService.ListComponentAsync(Catalog.Id);
            return Page();
        }
    }
}
