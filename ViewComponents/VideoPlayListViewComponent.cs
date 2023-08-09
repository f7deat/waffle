﻿using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components.Lister;

namespace Waffle.ViewComponents
{
    public class VideoPlayListViewComponent : BaseViewComponent<VideoPlayList>
    {
        private readonly ICatalogService _catalogService;
        public VideoPlayListViewComponent(IWorkService workService, ICatalogService catalogService) : base(workService)
        {
            _catalogService = catalogService;
        }

        protected override async Task<VideoPlayList> ExtendAsync(VideoPlayList work)
        {
            var videos = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Video,
                PageSize = work.PageSize
            });
            work.PlaylistItems = videos?.Data?.Select(x => new PlaylistItem
            {
                Name = x.Name,
                Thumbnail = x.Thumbnail,
                Url = $"/video/{x.NormalizedName}",
                Date = x.ModifiedDate.ToString("f"),
                ViewCount = x.ViewCount.ToString("N0")
            }).ToList() ?? new();
            return work;
        }
    }
}
