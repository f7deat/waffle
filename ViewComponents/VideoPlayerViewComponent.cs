using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components.Specifications;

namespace Waffle.ViewComponents
{
    public class VideoPlayerViewComponent : BaseViewComponent<VideoPlayer>
    {
        public VideoPlayerViewComponent(IWorkService workService) : base(workService)
        {
        }
    }
}
