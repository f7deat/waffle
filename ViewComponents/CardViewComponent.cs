using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class CardViewComponent : BaseViewComponent<Card>
    {
        public CardViewComponent(IWorkService workService) : base(workService) { }
    }
}
