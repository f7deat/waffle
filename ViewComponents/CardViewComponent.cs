using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class CardViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public CardViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var card = await _workService.GetAsync<Card>(id);
            if (card is null)
            {
                return View(Empty.DefaultView);
            }
            return View(card);
        }
    }
}
