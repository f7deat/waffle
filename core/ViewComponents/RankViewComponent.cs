using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class RankViewComponent(IWorkService workService) : BaseViewComponent<Rank>(workService)
{
    protected override Task<Rank> ExtendAsync(Rank work)
    {
        work.CatalogId = PageData.Id;
        if (work.Items != null)
        {
            work.Items = work.Items.OrderByDescending(x => x.Rating).ToList();
        }
        return base.ExtendAsync(work);
    }
}
