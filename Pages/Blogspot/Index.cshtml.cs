using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Blogspot
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
            Blogspot = new Catalog();
        }

        private ListResult<Catalog>? Catalog;
        public Catalog Blogspot;

        public async Task<IActionResult> OnGetAsync()
        {
            Blogspot = await _catalogService.EnsureDataAsync(nameof(Blogspot), CatalogType.Entry);
            ViewData["Title"] = Blogspot.Name;
            ViewData["Description"] = Blogspot.Description;

            Catalog = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active= true,
                Type = CatalogType.Blogspot
            });
            return Page();
        }

        public ListGroup ListBlog()
        {
            return new ListGroup
            {
                Name = "Feed",
                Items = Items() ?? new List<ListGroupItem>()
            };
        }

        private IEnumerable<ListGroupItem>? Items()
        {
            if (Catalog?.Data != null)
            {
                foreach (var item in Catalog.Data)
                {
                    yield return new ListGroupItem
                    {
                        Link = new Link
                        {
                            Href = $"/blogspot/list/{item.NormalizedName}",
                            Name = item.Name
                        }
                    };
                }
            }
        }
    }
}
