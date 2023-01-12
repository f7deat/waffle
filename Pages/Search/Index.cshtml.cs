using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models;
using Waffle.Models.Catalogs;
using Waffle.Models.Components;

namespace Waffle.Pages.Search
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        public IndexModel(ICatalogService catalogService)
        {
            _catalogService = catalogService;
            FilterOptions = new SearchFilterOptions
            {
                Current = 1,
                PageSize = 10
            };
        }

        [BindProperty(SupportsGet = true)]
        public SearchFilterOptions FilterOptions { get; set; }
        public ListResult<ArticleListItem>? Articles;

        public async Task<IActionResult> OnGetAsync()
        {
            if (FilterOptions.Current < 1)
            {
                return NotFound();
            }
            ViewData["Title"] = FilterOptions.SearchTerm;
            Articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions
            {
                Current = FilterOptions.Current,
                PageSize = 10,
                Name = FilterOptions.SearchTerm
            });
            return Page();
        }

        public List<Breadcrumb> GetBreadcrumbs()
        {
            var breadcrumb = new List<Breadcrumb>
            {
                new Breadcrumb
                {
                    Url = "/",
                    Name = "Home",
                    Position = 1,
                    Icon = "fas fa-home"
                },
                new Breadcrumb
                {
                    Url = "/search",
                    Name = "Search",
                    Position = 2,
                    Icon = "fas fa-search"
                },
                new Breadcrumb
                {
                    Url = $"/search?searchTerm={FilterOptions.SearchTerm}",
                    Name = FilterOptions.SearchTerm,
                    Position = 3,
                    Icon = "fas fa-tags"
                }
            };
            return breadcrumb;
        }
    }
}
