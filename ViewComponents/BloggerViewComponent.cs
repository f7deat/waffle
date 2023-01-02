using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Services.AppSettings;
using Waffle.Data;
using Waffle.ExternalAPI.Google;
using Waffle.ExternalAPI.Google.Models;

namespace Waffle.ViewComponents
{
    public class BloggerViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        private readonly IAppSettingService _appService;
        public BloggerViewComponent(ApplicationDbContext context, IAppSettingService appSettingService)
        {
            _context = context;
            _appService = appSettingService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var app = await _appService.EnsureSettingAsync(nameof(GoogleApiLibrary));
            if (string.IsNullOrEmpty(app.Value))
            {
                return View();
            }
            var apiLibrary = JsonSerializer.Deserialize<GoogleApiLibrary>(app.Value);
            if (apiLibrary is null)
            {
                return View();
            }
            var workContent = await _context.WorkContents.FindAsync(id);
            if (string.IsNullOrEmpty(workContent?.Arguments))
            {
                return View();
            }
            return View(JsonSerializer.Deserialize<Blogger>(workContent.Arguments));
        }
    }
}
