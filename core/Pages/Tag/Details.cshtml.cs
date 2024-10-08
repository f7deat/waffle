using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components.Lister;
using Waffle.Models.ViewModels;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Pages.Tag;

public class DetailsModel : DynamicPageModel
{
    private readonly IProductService _productService;
    public DetailsModel(ICatalogService catalogService, IProductService productService) : base(catalogService)
    {
        _productService = productService;
    }

    public ListResult<CatalogListItem>? Articles;
    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;
    [BindProperty(SupportsGet = true)]
    [UIHint(UIHint.SearchBox)]
    public string? SearchTerm { get; set; }

    public IEnumerable<ProductListItem> Products = new List<ProductListItem>();
    public ListResult<CatalogListItem> Albums = new();
    public ListResult<CatalogListItem> Locations = new();
    public VideoPlayList Videos = new();

    public async Task<IActionResult> OnGetAsync(string normalizedName)
    {
        Articles = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Current = Current,
            Name = SearchTerm,
            Type = CatalogType.Article,
            PageSize = 12,
            Locale = PageData.Locale
        });

        Products = await _productService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Current = Current,
            Name = SearchTerm,
            Type = CatalogType.Product,
            Locale = PageData.Locale
        });

        Albums = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Album,
            Locale = PageData.Locale
        });

        Locations = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Location,
            Locale = PageData.Locale
        });


        var videos = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Video,
            Locale = PageData.Locale
        });
        Videos.HasData = videos.HasData;
        if (videos.HasData)
        {
            Videos.Title = "Videos";
            Videos.PlaylistItems = videos.Data?.Select(x => new PlaylistItem
            {
                Date = x.ModifiedDate.ToString("D"),
                Name = x.Name,
                Thumbnail = x.Thumbnail,
                Url = x.GetUrl(),
                ViewCount = x.ViewCount.ToNumber()
            }).ToList() ?? new();
        }
        return Page();
    }
}
