using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Data;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ViewComponents
{
    public class BloggerViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly IGoogleService _googleService;
        public BloggerViewComponent(ApplicationDbContext context, IGoogleService googleService)
        {
            _context = context;
            _googleService = googleService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (string.IsNullOrEmpty(work?.Arguments))
            {
                return View();
            }
            var blogger = JsonSerializer.Deserialize<Blogger>(work.Arguments);
            if (blogger is null)
            {
                return View();
            }
            return View(await _googleService.BloggerPostsAsync(blogger.BlogId, blogger.ApiKey, 5, Request.Query["pageToken"], Request.Query["labels"]));
        }
    }
}
