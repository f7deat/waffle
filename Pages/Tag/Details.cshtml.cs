using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Tag
{
    public class DetailsModel : DynamicPageModel
    {
        public DetailsModel(ICatalogService catalogService) : base(catalogService)
        {
        }

        public IEnumerable<Catalog> Catalogs = new List<Catalog>();
        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        [BindProperty(SupportsGet = true)]
        public string? SearchTerm { get; set; }

        public Pagination Pagination = new();
        public ListResult<Catalog> Products = new();
        public List<Catalog> Albums = new();

        public async Task<IActionResult> OnGetAsync(string normalizedName)
        {
            var catalogs = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
            {
                Current = Current,
                Name = SearchTerm,
                Type = CatalogType.Article
            });

            Products = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
            {
                Current = Current,
                Name = SearchTerm,
                Type = CatalogType.Shop
            });

            var albums = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
            {
                Active = true,
                Name = SearchTerm,
                Type = CatalogType.Album
            });
            Albums = albums.Data?.ToList() ?? new();

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
