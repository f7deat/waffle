using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class MasonryViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;

        public MasonryViewComponent(IWorkService workService)
        {
            _workService = workService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var masonry = await _workService.GetAsync<Masonry>(id);
            if (masonry is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            return View();
        }
    }
}
