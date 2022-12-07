using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Microsoft.EntityFrameworkCore;
using Waffle.Models.Layout;
using System.Text.Json;

namespace Waffle.ViewComponents
{
    public class HeadViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public HeadViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var head = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName == nameof(Head));

            if (head != null && !string.IsNullOrEmpty(head.Value))
            {
                ViewBag.Data = JsonSerializer.Deserialize<Head>(head.Value);
            }

            return View();
        }
    }
}
