using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ColumnViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public ColumnViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var column = await _context.WorkContents.FindAsync(id);
            if (column is null)
            {
                return View();
            }

            var workItem = from b in _context.WorkContents
                           join c in _context.Components on b.ComponentId equals c.Id
                           where b.ParentId == id
                           select new WorkListItem
                           {
                               Id = b.Id,
                               Name = b.Name,
                               NormalizedName = c.NormalizedName
                           };

            ViewBag.Column = new Column
            {
                Id = id,
                Arguments = column.Arguments,
                WorkListItems = await workItem.ToListAsync()
            };

            return View();
        }
    }
}
