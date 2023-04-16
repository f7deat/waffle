using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
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

        public Pagination Pagination => new();

        protected override async Task<Feed> ExtendAsync(Feed feed)
        {
            var articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions());
            feed.Articles = articles.Data;
            return feed;
        }
    }
}
