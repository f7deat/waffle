using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class RankViewComponent(IWorkService workService) : BaseViewComponent<Rank>(workService)
{
    protected override Rank Extend(Rank work)
    {
        work.CatalogId = PageData.Id;
        return base.Extend(work);
    }
}
