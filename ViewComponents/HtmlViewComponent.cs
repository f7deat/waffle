using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;

namespace Waffle.ViewComponents
{
    public class HtmlViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public HtmlViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var data = await _context.WorkItems.FindAsync(id);
            if (data is null)
            {
                return View();
            }
            return View(data);
        }
    }
}
