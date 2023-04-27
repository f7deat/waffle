using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Blogspot
{
    public class ListModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public ListModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
            BlogUrl = string.Empty;
            Pagination = new Pagination();
        }

        public Catalog Catalog = new();
        public IEnumerable<ComponentListItem>? Components;
        public List<BloggerItem> Posts = new();
        public string BlogUrl;
        public string? NextPageToken;
        public string? PrevPageToken;
        public Pagination Pagination;
        private string NormalizedName = string.Empty;
        public bool HasNextPage => !string.IsNullOrEmpty(NextPageToken);
        public bool HasPrevPage => !string.IsNullOrEmpty(PrevPageToken);
        public string NextPageUrl => BlogUrl + $"?pageToken={NextPageToken}";
        public string PrevPageUrl => BlogUrl + $"?pageToken={PrevPageToken}";

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            BlogUrl = $"/blogspot/list/{normalizedName}";
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return NotFound();
            }
            NormalizedName = normalizedName;
            Catalog = await _catalogService.GetByNameAsync(normalizedName) ?? new Catalog();
            if (Catalog is null)
            {
                return NotFound();
            }
            ViewData["Title"] = Catalog.Name;
            ViewData["Desctiption"] = Catalog.Description;
            Components = await _catalogService.ListComponentAsync(Catalog.Id);

            Pagination = new Pagination
            {
                HasPrevPage = HasPrevPage,
                HasNextPage = HasNextPage,
                NextPageUrl = NextPageUrl,
                PrevPageUrl = PrevPageUrl
            };
            return Page();
        }

        public string GetUrl(string path) => $"/blogspot/{NormalizedName}{path}";
    }
}
