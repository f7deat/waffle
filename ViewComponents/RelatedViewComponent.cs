using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class RelatedViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        public RelatedViewComponent(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public async Task<IViewComponentResult> InvokeAsync(RelatedProps props)
        {
            var articles = await _catalogService.ArticleRelatedListAsync(new ArticleRelatedFilterOption
            {
                Current = 1,
                PageSize = 4,
                CatalogId = props.CatalogId,
                TagIds = props.TagIds,
            });
            if (articles?.Data == null || !articles.Data.Any())
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = props.CatalogId.ToString()
                });
            }
            return View(articles.Data);
        }
    }

    public class RelatedProps
    {
        public IEnumerable<Guid> TagIds { get; set; } = null!;
        public Guid CatalogId { get; set; }
    }
}
