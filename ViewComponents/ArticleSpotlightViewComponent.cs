using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Models.Components.Specifications;

namespace Waffle.ViewComponents
{
    public class ArticleSpotlightViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        private readonly IWorkService _workService;

        public ArticleSpotlightViewComponent(ICatalogService catalogService, IWorkService workService)
        {
            _catalogService = catalogService;
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid? workId)
        {
            var articles = await _catalogService.ArticlePickerListAsync();
            if (articles is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = Guid.Empty.ToString()
                });
            }
            string title = "Có thể bạn thích";
            int pageSize = 5;
            if (workId != null)
            {
                var work = await _workService.GetAsync<ArticleSpotlight>(workId ?? Guid.Empty);
                if (work != null)
                {
                    title = work.Title;
                    pageSize = work.PageSize;
                }
            }
            var model = new ArticleSpotlight
            {
                Title = title,
                Articles = articles.ToList(),
                PageSize = pageSize
            };
            return View(model);
        }
    }
}
