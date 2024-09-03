using Waffle.Models.Components;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace Waffle.ViewComponents;

public class JumbotronViewComponent : ViewComponent
{
    private readonly SettingOptions Options;
    private readonly IWorkService _workService;
    public JumbotronViewComponent(IWorkService workService, IOptions<SettingOptions> options) 
    {
        Options = options.Value;
        _workService = workService;
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid workId)
    {
        var work = await _workService.GetAsync<Jumbotron>(workId);
        if (work is null)
        {
            return View(new Jumbotron
            {
                Title = ViewData["Title"]?.ToString(),
                Description = ViewData["Description"]?.ToString()
            });
        }
        return View(Options.Theme, work);
    }
}
