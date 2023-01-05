using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Services.AppSettings;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.ExternalAPI.Models;
using Waffle.Models.Components;
using Waffle.Models.Layout;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class AppSettingController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAppSettingService _appSettingService;
        public AppSettingController(ApplicationDbContext context, IAppSettingService appSettingService)
        {
            _context = context;
            _appSettingService = appSettingService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync() => Ok(await _appSettingService.ListAsync());

        [HttpGet("layout/{id}")]
        public async Task<IActionResult> GetLayoutAsync([FromRoute] Guid id)
        {
            var setting = await _context.AppSettings.FindAsync(id);
            if (setting is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var query = from a in _context.WorkItems
                        join b in _context.WorkContents on a.CatalogId equals setting.Id
                        where a.CatalogId == setting.Id
                        orderby a.SortOrder ascending
                        select b;
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
        }

        [HttpPost("layout/head/save")]
        public async Task<IActionResult> SaveLayoutHeadAsync([FromBody] Head model)
        {
            var head = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Head)));
            head ??= await _appSettingService.EnsureSettingAsync(nameof(Head));
            head.Value = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("facebook/save")]
        public async Task<IActionResult> SaveFacebookAsync([FromBody] Facebook model)
        {
            var app = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Facebook)));
            if (app is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "App not found!"
                }));
            }
            app.Value = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("telegram/save")]
        public async Task<IActionResult> SaveTelegramAsync([FromBody] Telegram model) => Ok(await _appSettingService.SaveTelegramAsync(model));

        [HttpGet("telegram/configuration")]
        public async Task<IActionResult> GetTelegramConfigurationAsync()
        {
            var appSetting = await _appSettingService.EnsureSettingAsync(nameof(Telegram));
            bool bot = false;
            if (!string.IsNullOrEmpty(appSetting.Value))
            {
                var telegram = JsonSerializer.Deserialize<Telegram?>(appSetting.Value);
                if (telegram != null)
                {
                    bot = !string.IsNullOrEmpty(telegram.Bot);
                }
            }
            return Ok(new
            {
                data = new[]
                    {
                    new {
                        id = "bot",
                        name = "BOT",
                        active = bot
                    }
                }
            });
        }

        [HttpPost("blogger/save")]
        public async Task<IActionResult> SaveBloggerAsync([FromBody] Blogger model)
        {
            var app = await _appSettingService.EnsureSettingAsync(nameof(Blogger));
            app.Value = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("footer/{id}")]
        public async Task<IActionResult> GetFooterAsync([FromRoute] Guid id) => Ok(await _appSettingService.GetFooterAsync(id));

        [HttpPost("footer/save")]
        public async Task<IActionResult> SaveFooterAsync([FromBody] Footer args) => Ok(await _appSettingService.SaveFooterAsync(args));
    }
}
