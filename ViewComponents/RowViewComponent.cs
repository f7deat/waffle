using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
            if (string.IsNullOrEmpty(workContent?.Arguments))
            {
                return View(Empty.DefaultView);
            }
            var row = JsonSerializer.Deserialize<Row>(workContent.Arguments);
            if (row != null)
            {
                row.Columns = await _context.WorkContents.Where(x => x.ParentId == id && x.ComponentId != Guid.Empty).Select(x => x.Id).ToListAsync();
            }
            return View(row);
        }
    }
}
