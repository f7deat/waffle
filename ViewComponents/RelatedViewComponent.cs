using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
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
        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var articles = await _catalogService.ArticleRelatedListAsync(workId);
            if (articles == null || !articles.Any())
            {
                return View(Empty.DefaultView);
            }
            return View(articles);
        }
    }
}
