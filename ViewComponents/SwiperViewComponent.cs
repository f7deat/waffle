using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class SwiperViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SwiperViewComponent> _logger;
        public SwiperViewComponent(ApplicationDbContext context, ILogger<SwiperViewComponent> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                _logger.LogError("Work content not found: {0}", id);
                return View();
            }
            ViewBag.SwiperSlides = GetImagesAsync(id);

            return View();
        }

        private async IAsyncEnumerable<Image> GetImagesAsync(Guid id)
        {
            var workContents = await _context.WorkContents.Where(x => x.ParentId == id && x.Active).ToListAsync();
            foreach (var item in workContents)
            {
                if (string.IsNullOrEmpty(item.Arguments))
                {
                    continue;
                }
                yield return JsonSerializer.Deserialize<Image>(item.Arguments) ?? new Image();
            }
        }
    }
}
