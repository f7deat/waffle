using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Components.Lister;

namespace Waffle.Pages.Tag;

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
    public ListResult<Catalog> Albums = new();
    public ListResult<Catalog> Locations = new();
    public VideoPlayList Videos = new();

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
            Type = CatalogType.Product
        });

        Albums = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Album
        });

        Locations = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Location
        });


        var videos = await _catalogService.ListByTagAsync(PageData.Id, new CatalogFilterOptions
        {
            Active = true,
            Name = SearchTerm,
            Type = CatalogType.Video
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
                ViewCount = x.ViewCount.ToString("N0")
            }).ToList() ?? new();
        }

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
