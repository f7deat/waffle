using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Interfaces;

namespace Waffle.Core.Foundations;

public abstract class BaseViewComponent<T>(IWorkService workService) : ViewComponent where T : class
{
    private readonly IWorkService _workService = workService;

    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
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
        if (work is IComponent component)
        {
            component.Id = workId;
        }
        work = await ExtendAsync(work);
        return View(ViewName, work);
    }

    protected virtual Task<T> ExtendAsync(T work) => Task.FromResult(work);
    protected virtual T Extend(T work) => work;

    protected virtual string ViewName { get; set; } = "Default";
}
