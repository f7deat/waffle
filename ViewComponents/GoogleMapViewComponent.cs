using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class GoogleMapViewComponent : BaseViewComponent<GoogleMap>
    {
        public GoogleMapViewComponent(IWorkService workService) : base(workService)
        {
        }
    }
}
