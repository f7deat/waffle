using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Constants;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
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
        public async Task<IActionResult> ExportAsync() => Ok(new BackupModel
        {
            WorkContents = await _context.WorkContents.ToListAsync(),
            WorkItems = await _context.WorkItems.ToListAsync(),
            FileContents = await _context.FileContents.ToListAsync(),
            FileItems = await _context.FileItems.ToListAsync(),
            AppSettings = await _context.AppSettings.ToListAsync(),
            Components = await _context.Components.ToListAsync(),
            Catalogs = await _context.Catalogs.ToListAsync()
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
            var data = await JsonSerializer.DeserializeAsync<BackupModel>(stream);
            if (data is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Import failed!"
                }));
            }
            if (data.WorkContents != null && data.WorkContents.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkContents");
                await _context.WorkContents.AddRangeAsync(data.WorkContents);
            }
            if (data.WorkItems != null && data.WorkItems.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.WorkItems");
                await _context.WorkItems.AddRangeAsync(data.WorkItems);
            }

            if (data.FileContents != null && data.FileContents.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.FileContents");
                await _context.FileContents.AddRangeAsync(data.FileContents);
            }
            if (data.FileItems != null && data.FileItems.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.FileItems");
                await _context.FileItems.AddRangeAsync(data.FileItems);
            }

            if (data.Catalogs != null && data.Catalogs.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Catalogs");
                await _context.Catalogs.AddRangeAsync(data.Catalogs);
            }

            if (data.AppSettings != null && data.AppSettings.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.AppSettings");
                await _context.AppSettings.AddRangeAsync(data.AppSettings);
            }

            if (data.Components != null && data.Components.Any())
            {
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM dbo.Components");
                await _context.Components.AddRangeAsync(data.Components);
            }
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
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
            await EnsureCatalog("home", CatalogType.Entry);
            await EnsureCatalog("shop", CatalogType.Entry);
            await EnsureSetting();

            await EnsureComponent(nameof(BlockEditor));
            await EnsureComponent(nameof(Document));
            await EnsureComponent(nameof(ContactForm));
            await EnsureComponent(nameof(Swiper));
            await EnsureComponent(nameof(Card));
            await EnsureComponent(nameof(Masonry));

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
