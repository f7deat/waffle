using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Components.Lister;
using Waffle.Models.ViewModels;

namespace Waffle.Pages.Search;

public class IndexModel : EntryPageModel
{
    private readonly ILocalizationService _localizationService;
    private readonly IProductService _productService;
    public IndexModel(ICatalogService catalogService, ILocalizationService localizationService, IProductService productService) : base(catalogService)
    {
        _localizationService = localizationService;
        _productService = productService;
    }

    [BindProperty(SupportsGet = true)]
    public SearchFilterOptions FilterOptions { get; set; } = new();
    public ListResult<CatalogListItem> Articles = new();
    public List<PlaylistItem> PlaylistItems = new();
    public Feed ProductFeed = new();

    public async Task<IActionResult> OnGetAsync()
    {
        if (FilterOptions.Current < 1)
        {
            return NotFound();
        }
        PageData.Name = FilterOptions.SearchTerm ?? await _localizationService.GetAsync("search");
        ViewData["Title"] = PageData.Name;
        Articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Current = FilterOptions.Current,
            Name = FilterOptions.SearchTerm,
            PageSize = 12,
            Active = true,
            Type = CatalogType.Article,
            Locale = PageData.Locale
        });

        var videos = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Name = FilterOptions.SearchTerm,
            Current = FilterOptions.Current,
            Active = true,
            Type = CatalogType.Video,
            PageSize = 4,
            Locale = PageData.Locale
        });

        PlaylistItems = videos.Data?.Select(x => new PlaylistItem
        {
            Name = x.Name,
            Date = x.ModifiedDate.ToString("D"),
            Thumbnail = x.Thumbnail,
            ViewCount = x.ViewCount.ToNumber(),
            Url = x.GetUrl()
        }).ToList() ?? new();


        var products = await _productService.ListAsync(new ProductFilterOptions
        {
            Name = FilterOptions.SearchTerm,
            PageSize = 8,
            Active = true,
            Locale = PageData.Locale
        });
        ProductFeed = new Feed
        {
            Name = await _localizationService.GetAsync(nameof(Product), PageData.Locale),
            Products = products.Data,
            ItemPerRow = "col-6 col-md-3"
        };

        return Page();
    }

    public async Task<List<Breadcrumb>> GetBreadcrumbs()
    {
        var breadcrumb = new List<Breadcrumb>
        {
            new() {
                Url = $"/?locale={PageData.Locale}",
                Name = await _localizationService.GetAsync("home"),
                Position = 1,
                Icon = "fas fa-home"
            },
            new() {
                Url = $"/search?locale={PageData.Locale}",
                Name = await _localizationService.GetAsync("search"),
                Position = 2,
                Icon = "fa-solid fa-magnifying-glass"
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
