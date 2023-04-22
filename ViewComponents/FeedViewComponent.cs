using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class FeedViewComponent : BaseViewComponent<Feed>
    {
        private readonly ICatalogService _catalogService;

        public FeedViewComponent(ICatalogService catalogService, IWorkService workService) : base(workService)
        {
            _catalogService = catalogService;
        }

        protected override async Task<Feed> ExtendAsync(Feed feed)
        {
            var type = feed.Type ?? CatalogType.Article;
            var articles = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                PageSize = feed.PageSize,
                Type = type
            });
            ViewName = type.ToString();
            feed.Articles = articles.Data?.ToList() ?? new();
            return feed;
        }
    }
}
