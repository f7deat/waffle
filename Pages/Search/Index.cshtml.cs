using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Catalogs;
using Waffle.Models.Components;

namespace Waffle.Pages.Search
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly ILocalizationService _localizationService;
        public IndexModel(ICatalogService catalogService, ILocalizationService localizationService)
        {
            _catalogService = catalogService;
            _localizationService = localizationService;
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
            ViewData["Title"] = FilterOptions.SearchTerm ?? await _localizationService.GetAsync("search");
            Articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions
            {
                Current = FilterOptions.Current,
                PageSize = 10,
                Name = FilterOptions.SearchTerm
            });
            return Page();
        }

        public async Task<List<Breadcrumb>> GetBreadcrumbs()
        {
            var breadcrumb = new List<Breadcrumb>
            {
                new Breadcrumb
                {
                    Url = "/",
                    Name = await _localizationService.GetAsync("home"),
                    Position = 1,
                    Icon = "fas fa-home"
                },
                new Breadcrumb
                {
                    Url = "/search",
                    Name = await _localizationService.GetAsync("search"),
                    Position = 2,
                    Icon = "fas fa-search"
                }
            };
            if (!string.IsNullOrWhiteSpace(FilterOptions.SearchTerm))
            {
                breadcrumb.Add(new Breadcrumb
                {
                    Url = $"/search?searchTerm={FilterOptions.SearchTerm}",
                    Name = FilterOptions.SearchTerm,
                    Position = 3,
                    Icon = "fas fa-tags"
                });
            }
            return breadcrumb;
        }
    }
}
