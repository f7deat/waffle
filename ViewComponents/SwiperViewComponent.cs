using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class SwiperViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public SwiperViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var swiper = await _workService.GetAsync<Swiper>(id);
            if (swiper is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            return View(swiper);
        }
    }
}
