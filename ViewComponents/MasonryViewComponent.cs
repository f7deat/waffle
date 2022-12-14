using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class MasonryViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public MasonryViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid workContentId)
        {
            var workContent = await _context.WorkContents.FindAsync(workContentId);
            if (workContent is null)
            {
                return View();
            }
            return View();
        }
    }
}
