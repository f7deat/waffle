using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class CatalogController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;
        public CatalogController(ApplicationDbContext context, ICatalogService catalogService)
        {
            _context = context;
            _catalogService = catalogService;
        }

        [HttpGet("view-count")]
        public async Task<IActionResult> GetViewCountAsync() => Ok(await _context.Catalogs.SumAsync(x => x.ViewCount));

        [HttpGet("entry/{normalizedName}")]
        public async Task<IActionResult> GetEntryAsync([FromRoute] string normalizedName)
        {
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Router missing!"
                }));
            }
            var data = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Type == CatalogType.Entry);
            if (data is null)
            {
                data = new Catalog
                {
                    Type = CatalogType.Entry,
                    NormalizedName = normalizedName,
                    Name = normalizedName,
                    CreatedDate = DateTime.Now,
                    Active = true,
                    ViewCount = 0
                };
                await _context.Catalogs.AddAsync(data);
                await _context.SaveChangesAsync();
            }
            return Ok(new
            {
                succeeded = true,
                data
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog == null)
            {
                return NotFound();
            }
            var data = new CatalogViewModel
            {
                Id = id,
                Name = catalog.Name,
                NormalizedName = catalog.NormalizedName,
                Description = catalog.Description,
                Type = catalog.Type
            };
            if (!string.IsNullOrEmpty(catalog.Setting))
            {
                data.Setting = JsonSerializer.Deserialize<CatalogSetting>(catalog.Setting) ?? new CatalogSetting();
            }
            return Ok(data);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] Catalog catalog) => Ok(await _catalogService.AddAsync(catalog));

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync(CatalogFilterOptions filterOptions)
        {
            var query = _context.Catalogs
                .Where(x => x.Type == filterOptions.Type && (string.IsNullOrEmpty(filterOptions.Name) || x.Name.ToLower().Contains(filterOptions.Name)) && (filterOptions.Active == null || x.Active == filterOptions.Active));
            var data = await query.OrderBy(x => x.NormalizedName).Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync();
            var total = await query.CountAsync();
            return Ok(new { data, total });
        }

        [HttpGet("tree")]
        public async Task<IActionResult> TreeAsync()
        {
            var returnValue = new List<Tree>();
            var parrent = await _context.Catalogs.Where(x => x.Active && x.ParentId == null && x.Type != CatalogType.Entry).ToListAsync();
            foreach (var catalog in parrent)
            {
                List<Tree>? children = null;
                if (await _context.Catalogs.AnyAsync(x => x.ParentId == catalog.ParentId))
                {
                    children = await _context.Catalogs.Where(x => x.Active && x.ParentId == catalog.Id).Select(x => new Tree
                    {
                        Key = x.Id,
                        Title = x.Name
                    }).ToListAsync();
                }
                returnValue.Add(new Tree
                {
                    Key = catalog.Id,
                    Title = catalog.Name,
                    Icon = GetIcon(catalog.Type),
                    Children = children
                });
            }
            return Ok(returnValue);
        }

        private static string GetIcon(CatalogType type)
        {
            switch (type)
            {
                case CatalogType.Entry:
                    return "🏠";
                case CatalogType.Setting:
                    return "⚙️";
                default:
                    return "🗍";
            }
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Catalog not found!"
                }));
            }
            if (await _context.Catalogs.AnyAsync(x => x.ParentId == catalog.Id))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child catalog first!" }));
            }
            if (await _context.WorkItems.AnyAsync(x => x.CatalogId == id))
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Please remove work item first!"
                }));
            }
            _context.Catalogs.Remove(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await _catalogService.ActiveAsync(id));

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] CatalogViewModel model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var catalog = await _context.Catalogs.FindAsync(model.Id);
            if (catalog is null)
            {
                return NoContent();
            }
            catalog.Name = model.Name;
            catalog.Type = model.Type;
            catalog.Setting = JsonSerializer.Serialize(model.Setting);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("tree-drop")]
        public async Task<IActionResult> DropAsync([FromBody] DropModel model)
        {
            var drop = await _context.Catalogs.FindAsync(model.DragNodeKey);
            if (drop is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var node = await _context.Catalogs.FindAsync(model.Node);
            if (node is null)
            {
                return Ok(IdentityResult.Failed());
            }
            drop.ParentId = model.Node;
            if (model.DropToGap)
            {
                drop.ParentId = null;
            }
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("categories/{type}")]
        public async Task<IActionResult> GetCategoriesAsync([FromRoute] CatalogType type) => Ok(await _context.Catalogs.Where(x => x.Type == type).ToListAsync());
    }
}
