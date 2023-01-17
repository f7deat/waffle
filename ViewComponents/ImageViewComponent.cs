using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ImageViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public ImageViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var image = await _workService.GetAsync<Image>(workId);
            if (image is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = workId.ToString()
                });
            }
            return View(image);
        }
    }
}
