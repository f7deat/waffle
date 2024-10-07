using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;
using Waffle.Models;
using Waffle.Core.Foundations;

namespace Waffle.ViewComponents;

public class ArticleSpotlightViewComponent : ViewComponent
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    private readonly ILocalizationService _localizationService;

    public ArticleSpotlightViewComponent(ICatalogService catalogService, IWorkService workService, ILocalizationService localizationService)
    {
        _catalogService = catalogService;
        _workService = workService;
        _localizationService = localizationService;
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
        string title = await _localizationService.GetAsync("ArticleSpotlightTitle", PageData.Locale);
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
