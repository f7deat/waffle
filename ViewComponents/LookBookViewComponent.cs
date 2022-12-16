using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class LookBookViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public LookBookViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workContentId)
        {
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.WorkContentId equals b.Id
                        where a.WorkContentId == workContentId
                        orderby a.SortOrder ascending
                        select b.Arguments;

            var image = await query.FirstOrDefaultAsync();
            if (image == null) return View();

            return View(JsonSerializer.Deserialize<Image>(image));
        }
    }
}
