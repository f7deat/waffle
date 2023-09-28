using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents.Listers;

public class ArticleListerViewComponent : BaseViewComponent<ArticleLister>
{
    public ArticleListerViewComponent(IWorkService workService) : base(workService)
    {
    }

    protected override Task<ArticleLister> ExtendAsync(ArticleLister work)
    {
        return base.ExtendAsync(work);
    }
}
