using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BackupController(ApplicationDbContext context)
        {
            _context = context;
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

        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeAsync()
        {
            await EnsureHomePage();
            await EnsureComponent(nameof(BlockEditor));
            await EnsureComponent(nameof(Document));
            await EnsureComponent(nameof(SendGrid));
            await EnsureComponent(nameof(ContactForm));
            await EnsureComponent(nameof(Swiper));
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

        private async Task EnsureHomePage()
        {
            if (!await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals("home")))
            {
                await _context.Catalogs.AddAsync(new Catalog
                {
                    Name = "Home",
                    NormalizedName = "home",
                    Active = true,
                    CreatedDate = DateTime.Now,
                });
            }
        }
    }
}
