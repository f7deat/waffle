using Microsoft.AspNetCore.Mvc;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ViewComponents
{
    public class TrendViewComponent : ViewComponent
    {
        private readonly IGoogleService _googleService;
        public TrendViewComponent(IGoogleService googleService) => _googleService = googleService;

        public async Task<IViewComponentResult> InvokeAsync(Guid id) => View(await _googleService.GetDailyTrendingAsync());
    }
}
