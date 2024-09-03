using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;

namespace Waffle.ViewComponents.Listers;

public class LatestNewsViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    private readonly SettingOptions Options;

    public LatestNewsViewComponent(IWorkService workService, ICatalogService catalogService, IOptions<SettingOptions> options)
    {
        _catalogService = catalogService;
        _workService = workService;
        Options = options.Value;
    }

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
        var work = await _workService.GetAsync<LatestNews>(workId);
        if (work is null)
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = workId.ToString()
            });
        }
        var articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            Current = 1,
            PageSize = work.PageSize,
            Type = CatalogType.Article,
            Locale = PageData.Locale
        });
        work.Data = articles.Data;
        return View(Options.Theme, work);
    }
}
