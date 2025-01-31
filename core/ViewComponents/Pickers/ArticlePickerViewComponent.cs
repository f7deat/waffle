using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components.Pickers;

namespace Waffle.ViewComponents.Pickers;

public class ArticlePickerViewComponent(IWorkService workService, ICatalogService _catalogService) : BaseViewComponent<ArticlePicker>(workService)
{
    protected override async Task<ArticlePicker> ExtendAsync(ArticlePicker work)
    {
        var articles = await _catalogService.ListByTagAsync(work.TagId, new CatalogFilterOptions
        {
            Type = CatalogType.Article,
            Active = true,
            PageSize = 5,
            Locale = PageData.Locale
        });
        work.Articles = articles.Data?.ToList() ?? [];
        return work;
    }
}
