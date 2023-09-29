using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.Listers;

public class ArticleListerViewComponent : BaseViewComponent<ArticleLister>
{
    private readonly ICatalogService _catalogService;
    
    public ArticleListerViewComponent(IWorkService workService, ICatalogService catalogService) : base(workService)
    {
        _catalogService = catalogService;
    }

    protected override async Task<ArticleLister> ExtendAsync(ArticleLister work)
    {
        var articles = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            Current = 1,
            PageSize = 10,
            ParentId = ParentData?.ParentId
        });
        work.Articles = articles.Data;
        return work;
    }
}
