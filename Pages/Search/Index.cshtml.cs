using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Components.Lister;

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
        public ListResult<Catalog> Articles = new();
        public List<PlaylistItem> PlaylistItems = new();
        public Feed ProductFeed = new();

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
                Name = FilterOptions.SearchTerm
            });

            var videos = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Name = FilterOptions.SearchTerm,
                Current = FilterOptions.Current,
                Active = true,
                Type = CatalogType.Video,
                PageSize = 4
            });

            PlaylistItems = videos.Data?.Select(x => new PlaylistItem
            {
                Name = x.Name,
                Date = x.ModifiedDate.ToString("D"),
                Thumbnail = x.Thumbnail,
                ViewCount = x.ViewCount.ToString("N0"),
                Url = x.GetUrl()
            }).ToList() ?? new();


            var product = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Name = FilterOptions.SearchTerm,
                Active = true,
                PageSize = 8,
                Type = CatalogType.Product
            });
            ProductFeed = new Feed
            {
                Name = "Sản phẩm",
                Articles = product.Data?.ToList() ?? new()
            };

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
