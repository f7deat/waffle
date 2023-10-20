using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Components.Lister;

namespace Waffle.Pages.Videos;

public class IndexModel : EntryPageModel
{
    public IndexModel(ICatalogService catalogService) : base(catalogService) { }

    public List<PlaylistItem> PlaylistItems = new();

    public async Task<IActionResult> OnGetAsync()
    {
        var videos = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            PageSize = 16,
            Type = CatalogType.Video
        });
        PlaylistItems = videos.Data?.Select(x => new PlaylistItem
        {
            Name = x.Name,
            Date = x.ModifiedDate.ToString("D"),
            Thumbnail = x.Thumbnail,
            ViewCount = x.ViewCount.ToNumber(),
            Url = x.GetUrl()
        }).ToList() ?? new();

        return Page();
    }
}
