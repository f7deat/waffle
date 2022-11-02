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
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null || string.IsNullOrEmpty(workContent.Arguments))
            {
                return View();
            }
            var workItem = from a in _context.WorkItems
                           join b in _context.WorkContents on a.WorkContentId equals b.Id
                           join c in _context.Components on b.ComponentId equals c.Id
                           where b.ParentId == id
                           select new WorkListItem
                           {
                               Id = a.WorkContentId,
                               Name = b.Name,
                               NormalizedName = c.NormalizedName
                           };
            var model = new Column
            {
                Id = id,
                Value = workContent.Arguments,
                WorkListItems = await workItem.ToListAsync()
            };
            return View(model);
        }
    }
}
