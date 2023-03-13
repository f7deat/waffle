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
            Posts = new ListGroup();
        }

        public Catalog? Catalog;
        public IEnumerable<ComponentListItem>? Components;
        public ListGroup Posts;

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
            Posts = new ListGroup
            {
                Name = Catalog.Name,
                Items = GetItems(response.Items, Catalog.NormalizedName)
            };
            return Page();
        }

        private IEnumerable<ListGroupItem> GetItems(List<BloggerItem> items, string? normalizedName)
        {
            foreach (var item in items)
            {
                yield return new ListGroupItem
                {
                    Link = new Link
                    {
                        Href = $"/blogspot/{normalizedName}{item.Path}",
                        Name = item.Title
                    }
                };
            }
        }
    }
}
