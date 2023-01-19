using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ArticlePickerViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        public ArticlePickerViewComponent(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var articles = await _catalogService.ArticlePickerListAsync();
            if (articles is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = Guid.Empty.ToString()
                });
            }
            return View(articles);
        }
    }
}
