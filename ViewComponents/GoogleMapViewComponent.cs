using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class GoogleMapViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public GoogleMapViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var map = await _workService.GetAsync<GoogleMap>(workId);
            if (map is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = workId.ToString()
                });
            }
            return View(map);
        }
    }
}
