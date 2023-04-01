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
        private readonly IGoogleService _googleService;
        private readonly IWorkService _workService;
        public ListModel(ICatalogService catalogService, IGoogleService googleService, IWorkService workService)
        {
            _catalogService = catalogService;
            _googleService = googleService;
            _workService = workService;
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

            var blogger = await _workService.GetAsync<Blogger>(Components.First().Id);
            if (blogger is null)
            {
                return NotFound();
            }
            var response = await _googleService.BloggerPostsAsync(blogger.BlogId, blogger.ApiKey, 10, Request.Query["pageToken"], Request.Query["labels"]);
            if (response is null || response.Items is null)
            {
                return NotFound();
            }
            Posts = response.Items;

            NextPageToken = response.NextPageToken;
            PrevPageToken = response.PrevPageToken;
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

        private static IEnumerable<ListGroupItem> GetItems(List<BloggerItem> items, string? normalizedName)
        {
            foreach (var item in items)
            {
                yield return new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/blogspot/{normalizedName}{item.Path}",
                        Name = item.Title ?? string.Empty
                    }
                };
            }
        }
    }
}
