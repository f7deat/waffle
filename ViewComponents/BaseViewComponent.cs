using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Entities;

namespace Waffle.ViewComponents
{
    public abstract class BaseViewComponent<T> : ViewComponent where T : class
    {
        private readonly IWorkService _workService;
        protected Catalog PageData
        {
            get
            {
                RouteData.Values.TryGetValue(nameof(Catalog), out var values);
                return values as Catalog ?? new();
            }
        }
        public BaseViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var work = await _workService.GetAsync<T>(workId);
            if (work is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = workId.ToString()
                });
            }
            work = await ExtendAsync(work);
            return View(ViewName, work);
        }

        protected virtual Task<T> ExtendAsync(T work) => Task.FromResult(work);

        protected virtual string ViewName { get; set; } = "Default";
    }
}
