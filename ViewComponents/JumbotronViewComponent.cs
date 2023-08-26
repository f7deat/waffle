using Waffle.Models.Components;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Foundations;

namespace Waffle.ViewComponents;

public class JumbotronViewComponent : BaseViewComponent<Jumbotron>
{
    public JumbotronViewComponent(IWorkService workService) : base(workService) { }
}
