using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class FeedViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        private readonly ApplicationDbContext _context;
        public FeedViewComponent(ICatalogService catalogService, ApplicationDbContext context)
        {
            _catalogService = catalogService;
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var work = await _context.WorkContents.FindAsync(workId);
            if (work is null)
            {
                return View(Empty.DefaultView);
            }
            var articles = await _catalogService.ArticleListAsync(new BasicFilterOptions
            {
                PageSize = 12,
                Current = 1
            });
            return View(new Feed
            {
                Name = work.Name,
                Articles = articles.Data
            });
        }
    }
}
