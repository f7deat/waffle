using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class LookbookViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public LookbookViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid workId)
        {
            var lookbook = await _context.WorkContents.FindAsync(workId);
            if (lookbook is not null)
            {
                ViewBag.Images = GetImagesAsync(workId);
            }
            return View();
        }

        private async IAsyncEnumerable<Image?> GetImagesAsync(Guid workId)
        {
            var images = await _context.WorkContents.Where(x => x.Active && x.ParentId == workId).ToListAsync();
            foreach (var image in images)
            {
                if (string.IsNullOrEmpty(image.Arguments))
                {
                    continue;
                }
                yield return JsonSerializer.Deserialize<Image>(image.Arguments);
            }
        }
    }
}
