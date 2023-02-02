using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class FeedViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        private readonly IWorkService _workService;
        public FeedViewComponent(ICatalogService catalogService, ApplicationDbContext context, IWorkService workService)
        {
            _catalogService = catalogService;
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var work = await _workService.FindAsync(workId);
            if (work is null)
            {
                return View(Empty.DefaultView);
            }
            var articles = await _catalogService.ArticleListAsync(new ArticleFilterOptions());
            return View(new Feed
            {
                Name = work.Name,
                Articles = articles.Data
            });
        }
    }
}
