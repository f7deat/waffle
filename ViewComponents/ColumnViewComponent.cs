using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ColumnViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly IWorkService _workService;
        public ColumnViewComponent(ApplicationDbContext context, IWorkService workService)
        {
            _context = context;
            _workService = workService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var model = await _workService.GetColumnAsync(id);
            if (model != null)
            {
                var query = from b in _context.WorkContents
                               join c in _context.Components on b.ComponentId equals c.Id
                               where b.ParentId == id
                               select new WorkListItem
                               {
                                   Id = b.Id,
                                   Name = b.Name,
                                   NormalizedName = c.NormalizedName
                               };
                model.WorkListItems = await query.ToListAsync();
            }
            return View(model);
        }
    }
}
