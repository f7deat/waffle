using Microsoft.AspNetCore.Mvc;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Interfaces.IService;

namespace Waffle.ViewComponents
{
    public class CommentViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        public CommentViewComponent(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid catalogId)
        {
            var catalog = await _catalogService.FindAsync(catalogId);
            if (catalog is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = catalogId.ToString()
                });
            }
            return View();
        }
    }
}
