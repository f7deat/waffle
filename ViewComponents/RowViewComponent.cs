using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class RowViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public RowViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return View();
            }
            var cols = await _context.WorkContents.Where(x => x.ParentId == id).Select(x => x.Id).ToListAsync();
            var row = new Row
            {
                Cols = cols
            };
            return View(row);
        }
    }
}
