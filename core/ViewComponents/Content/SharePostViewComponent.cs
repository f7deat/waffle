using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components.Content;

namespace Waffle.ViewComponents.Content;

public class SharePostViewComponent : BaseViewComponent<SharePost>
{
    public SharePostViewComponent(IWorkService workService) : base(workService)
    {
    }
}
