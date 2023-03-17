using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IComponentService _componentService;
        private readonly IAppSettingService _appSettingService;
        private readonly ICatalogService _catalogService;
        private readonly IWorkService _workService;
        public BackupController(ApplicationDbContext context, RoleManager<IdentityRole> roleManager, IComponentService componentService, IAppSettingService appSettingService, ICatalogService catalogService, IWorkService workService)
        {
            _context = context;
            _roleManager = roleManager;
            _componentService = componentService;
            _appSettingService = appSettingService;
            _catalogService = catalogService;
            _workService = workService;
        }

        [HttpPost("export")]
        public async Task<IActionResult> ExportAsync() => Ok(new BackupListItems
        {
            WorkContents = await _context.WorkContents.ToListAsync(),
            WorkItems = await _context.WorkItems.ToListAsync(),
            FileContents = await _context.FileContents.ToListAsync(),
            AppSettings = await _context.AppSettings.ToListAsync(),
            Components = await _context.Components.ToListAsync(),
            Catalogs = await _context.Catalogs.ToListAsync(),
            Localizations = await _context.Localizations.ToListAsync()
        });

        [HttpPost("export/catalog/{id}")]
        public async Task<IActionResult> ExportCatalogAsync([FromRoute] Guid id) => Ok(new
        {
            catalog = await _catalogService.FindAsync(id),
            items = await _workService.ExportByCatalogAsync(id)
        });

        [HttpPost("import")]
        public async Task<IActionResult> ImportAsync([FromForm] IFormFile file)
        {
            if (file is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "File not found!"
                }));
            }
            var stream = file.OpenReadStream();
            var data = await JsonSerializer.DeserializeAsync<BackupListItems>(stream);
            if (data is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Import failed!"
                }));
            }
            if (data.WorkContents.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkContents");
                await _context.WorkContents.AddRangeAsync(data.WorkContents);
            }
            if (data.WorkItems.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkItems");
                await _context.WorkItems.AddRangeAsync(data.WorkItems);
            }
            if (data.FileContents.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.FileContents");
                await _context.FileContents.AddRangeAsync(data.FileContents);
            }
            if (data.Catalogs.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Catalogs");
                await _context.Catalogs.AddRangeAsync(data.Catalogs);
            }
            if (data.AppSettings.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.AppSettings");
                await _context.AppSettings.AddRangeAsync(data.AppSettings);
            }
            if (data.Components.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Components");
                await _context.Components.AddRangeAsync(data.Components);
            }
            if (data.Localizations.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Localizations");
                await _context.Localizations.AddRangeAsync(data.Localizations);
            }
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("statistic")]
        public async Task<IActionResult> StatisticAsync() => Ok(new
        {
            catalog = await _context.Catalogs.CountAsync(),
            workContent = await _context.WorkContents.CountAsync(),
            workItem = await _context.WorkItems.CountAsync(),
            component = await _context.Components.CountAsync(),
            fileContent = await _context.FileContents.CountAsync(),
            localization = await _context.Localizations.CountAsync()
        });

        [HttpGet("upgrade/list")]
        public async Task<IActionResult> UpgradeListAsync()
        {
            var data = new List<UpgradeListItem>();
            if (!await _roleManager.RoleExistsAsync(RoleName.Customer))
            {
                data.Add(new UpgradeListItem { Name = "Roles", Url = "/backup/upgrade/roles"});
            }
            if (!await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals(CatalogType.Article.ToString().ToLower())))
            {
                data.Add(new UpgradeListItem { Name = "Catalogs", Url = "#" });
            }
            return Ok(new {
                data,
                total = data.Count
            });
        }

        [HttpPost("upgrade/roles")]
        public async Task<IActionResult> UpgradeRolesAsync()
        {
            if (!await _roleManager.RoleExistsAsync(RoleName.Customer))
            {
                var role = new IdentityRole {
                    Name = RoleName.Customer
                };
                await _roleManager.CreateAsync(role);
            }
            return Ok(IdentityResult.Success);
        }

        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeAsync()
        {
            await _catalogService.EnsureDataAsync("home", CatalogType.Entry);
            await _catalogService.EnsureDataAsync("shop", CatalogType.Entry);

            await EnsureComponentsAsync();

            await _appSettingService.EnsureSettingAsync(nameof(SendGrid));
            await _appSettingService.EnsureSettingAsync(nameof(ExternalAPI.Telegram));
            await _appSettingService.EnsureSettingAsync(nameof(ExternalAPI.Facebook));

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("upgrade/components")]
        public async Task<IActionResult> UpgradeComponentAsync()
        {
            await EnsureComponentsAsync();
            return Ok(IdentityResult.Success);
        }

        private async Task EnsureComponentsAsync()
        {
            await _componentService.EnsureComponentAsync(nameof(BlockEditor));
            await _componentService.EnsureComponentAsync(nameof(Card));
            await _componentService.EnsureComponentAsync(nameof(ContactForm));
            await _componentService.EnsureComponentAsync(nameof(Document));
            await _componentService.EnsureComponentAsync(nameof(Image));
            await _componentService.EnsureComponentAsync(nameof(Swiper));
            await _componentService.EnsureComponentAsync(nameof(Masonry));
            await _componentService.EnsureComponentAsync(nameof(Lookbook));
            await _componentService.EnsureComponentAsync(nameof(Tag));
            await _componentService.EnsureComponentAsync(nameof(Feed));
            await _componentService.EnsureComponentAsync(nameof(Row));
            await _componentService.EnsureComponentAsync(nameof(Column));
            await _componentService.EnsureComponentAsync(nameof(Image));
            await _componentService.EnsureComponentAsync(nameof(Trend));
            await _componentService.EnsureComponentAsync(nameof(Navbar));
            await _componentService.EnsureComponentAsync(nameof(ArticlePicker));
            await _componentService.EnsureComponentAsync(nameof(Jumbotron));
        }
    }
}
