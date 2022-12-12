using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Catalogs;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        public BackupController(ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        [HttpPost("export")]
        public async Task<IActionResult> ExportAsync()
        {
            var data = new
            {
                workContents = await _context.WorkContents.ToListAsync(),
                workItems = await _context.WorkItems.ToListAsync(),
                components = await _context.Components.ToListAsync(),
                fileContents = await _context.FileContents.ToListAsync(),
                fileItems = await _context.FileItems.ToListAsync(),
                appSettings = await _context.AppSettings.ToListAsync()
            };
            return Ok(data);
        }

        [HttpGet("statistic")]

        public async Task<IActionResult> StatisticAsync()
        {
            var data = new
            {
                catalog = await _context.Catalogs.CountAsync(),
                workContent = await _context.WorkContents.CountAsync(),
                workItem = await _context.WorkItems.CountAsync(),
                component = await _context.Components.CountAsync(),
                fileContent = await _context.FileContents.CountAsync(),
                fileItem = await _context.FileItems.CountAsync()
            };
            return Ok(data);
        }

        [HttpGet("upgrade/list")]
        public async Task<IActionResult> UpgradeListAsync()
        {
            var data = new List<UpgradeListItem>();
            if (!await _roleManager.RoleExistsAsync(RoleName.Customer))
            {
                data.Add(new UpgradeListItem { Name = "Roles", Url = "/backup/upgrade/roles"});
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
            await EnsureCatalog("home", CatalogType.Default);
            await EnsureSetting();

            await EnsureComponent(nameof(BlockEditor));
            await EnsureComponent(nameof(Document));
            await EnsureComponent(nameof(ContactForm));
            await EnsureComponent(nameof(Swiper));
            await EnsureComponent(nameof(Card));

            await EnsureApp(nameof(SendGrid));
            await EnsureApp(nameof(ExternalAPI.Telegram));

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        private async Task EnsureComponent(string name)
        {
            if (!await _context.Components.AllAsync(x => x.NormalizedName.Equals(name)))
            {
                await _context.Components.AddAsync(new Component {
                    Active = true,
                    Name = name,
                    NormalizedName = name,
                });
            }
        }

        private async Task EnsureSetting()
        {
            var setting = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Setting)));
            if (setting is null)
            {
                setting = new Catalog
                {
                    NormalizedName = nameof(Setting),
                    Name = nameof(Setting),
                    Active = true,
                    CreatedDate = DateTime.Now
                };
                await _context.Catalogs.AddAsync(setting);
            }
            await _context.SaveChangesAsync();

            await EnsureCatalog(nameof(Header), CatalogType.Setting, setting.ParentId);

            await EnsureCatalog(nameof(Footer), CatalogType.Setting, setting.ParentId);
        }

        private async Task EnsureCatalog(string name, CatalogType type, Guid? parentId = null)
        {
            if (!await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals(name)))
            {
                await _context.Catalogs.AddAsync(new Catalog
                {
                    Name = name,
                    NormalizedName = name,
                    Active = true,
                    Type = type,
                    CreatedDate = DateTime.Now,
                    ParentId = parentId
                });
            }
        }

        private async Task EnsureApp(string name)
        {
            if (!await _context.AppSettings.AnyAsync(x => x.NormalizedName.Equals(name)))
            {
                await _context.AppSettings.AddAsync(new AppSetting {
                    Name = name,
                    NormalizedName = name,
                });
            }
        }
    }
}
