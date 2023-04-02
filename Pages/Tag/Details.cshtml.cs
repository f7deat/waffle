using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Tag
{
    public class DetailsModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public DetailsModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public Catalog Catalog = new();
        public IEnumerable<Catalog> Catalogs = new List<Catalog>();
        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        [BindProperty(SupportsGet = true)]
        public string? SearchTerm { get; set; }

        public Pagination Pagination = new();

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var catalog = await _catalogService.GetByNameAsync(normalizedName) ?? new Catalog { 
                NormalizedName = normalizedName,
                Name = normalizedName
            };
            Catalog = catalog;
            ViewData["Title"] = Catalog.Name;
            ViewData["Description"] = Catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;

            var catalogs = await _catalogService.ListByTagAsync(catalog.Id, new SearchFilterOptions
            {
                Current = Current,
                SearchTerm = SearchTerm
            });
            Catalogs = catalogs.Data ?? new List<Catalog>();
            Pagination = new Pagination
            {
                HasNextPage = catalogs.HasNextPage,
                HasPrevPage = catalogs.HasPreviousPage,
                NextPageUrl = $"/tag/{normalizedName}?current={Current + 1}",
                PrevPageUrl = $"/tag/{normalizedName}?current={Current - 1}",
                Total = catalogs.Total
            };
            return Page();
        }
    }
}
