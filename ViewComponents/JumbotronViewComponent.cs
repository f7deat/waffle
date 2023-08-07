using Waffle.Models.Components;
using Waffle.Core.Interfaces.IService;

namespace Waffle.ViewComponents;

public class JumbotronViewComponent : BaseViewComponent<Jumbotron>
{
    public JumbotronViewComponent(IWorkService workService) : base(workService) { }
}
