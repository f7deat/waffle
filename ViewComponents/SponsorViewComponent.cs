using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class SponsorViewComponent : BaseViewComponent<Sponsor>
    {
        public SponsorViewComponent(IWorkService workService) : base(workService)
        {
        }

        protected override Task<Sponsor> ExtendAsync(Sponsor work)
        {
            return base.ExtendAsync(work);
        }
    }
}
