using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IServices;

namespace Waffle.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        public HeaderViewComponent(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View(await _catalogService.GetHeaderAsync());
        }
    }
}
