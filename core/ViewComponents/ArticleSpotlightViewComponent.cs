using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Entities;
using Waffle.Core.Foundations;

namespace Waffle.ViewComponents;

public class ArticleSpotlightViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;

    public ArticleSpotlightViewComponent(ICatalogService catalogService, IWorkService workService)
    {
        _catalogService = catalogService;
        _workService = workService;
    }

    protected PageData PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(PageData), out var values);
            return values as PageData ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid? workId)
    {
        var articles = await _catalogService.ListSpotlightAsync(PageData, 5);
        if (!articles.Any())
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = Guid.Empty.ToString()
            });
        }
        string title = "Có thể bạn thích";
        int pageSize = 5;
        if (workId != null)
        {
            var work = await _workService.GetAsync<ArticleSpotlight>(workId ?? Guid.Empty);
            if (work != null)
            {
                title = work.Title;
                pageSize = work.PageSize;
            }
        }
        var model = new ArticleSpotlight
        {
            Title = title,
            Articles = articles,
            PageSize = pageSize
        };
        return View(model);
    }
}
