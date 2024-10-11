using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components.Pages;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;

namespace Waffle.ViewComponents;

public class HomeViewComponent : ViewComponent
{
    private readonly ApplicationDbContext _context;
    private readonly IWorkService _workService;
    private readonly SettingOptions Options;
    public HomeViewComponent(ApplicationDbContext context, IWorkService workService, IOptions<SettingOptions> options)
    {
        _context = context;
        _workService = workService;
        Options = options.Value;
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid workId)
    {
        var home = await _workService.GetAsync<Home>(workId);
        home ??= new Home();
        return View(Options.Theme, home);
    }
}
