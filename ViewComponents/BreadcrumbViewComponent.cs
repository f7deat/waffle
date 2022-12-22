using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BreadcrumbViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public BreadcrumbViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FirstOrDefaultAsync(x => x.Id == id);
            if (workContent != null && !string.IsNullOrEmpty(workContent.Arguments))
            {
                var card = JsonSerializer.Deserialize<Card>(workContent.Arguments);
                ViewBag.Data = card;
            }
            return View();
        }
    }
}
