using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;

namespace Waffle.ViewComponents
{
    public class ListGroupViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public ListGroupViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var data = await _workService.GetAsync<ListGroup>(id);
            if (data is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            data.Items = await _workService.GetListChildAsync<ListGroupItem>(id);
            return View(data);
        }
    }
}
