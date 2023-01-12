using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class TitleViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public TitleViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var data = await _context.WorkContents.FindAsync(id);
            if (data is null)
            {
                return View();
            }
            if (string.IsNullOrEmpty(data.Arguments))
            {
                return View();
            }
            var title = JsonSerializer.Deserialize<Title>(data.Arguments);
            return View(title);
        }
    }
}
