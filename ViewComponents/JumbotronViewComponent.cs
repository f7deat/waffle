using Microsoft.AspNetCore.Mvc;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Interfaces.IService;

namespace Waffle.ViewComponents
{
    public class JumbotronViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public JumbotronViewComponent(IWorkService workService)
        {
            _workService = workService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var jumbotron = await _workService.GetAsync<Jumbotron>(workId);
            if (jumbotron is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = workId.ToString()
                });
            }
            return View(jumbotron);
        }
    }
}
