using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class CatalogController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CatalogController(ApplicationDbContext context)
        {
            _context = context;
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
            };
            if (!string.IsNullOrEmpty(catalog.Setting))
            {
                data.Setting = JsonSerializer.Deserialize<CatalogSetting>(catalog.Setting) ?? new CatalogSetting();
            }
            return Ok(data);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] Catalog catalog)
        {
            if (catalog == null || string.IsNullOrWhiteSpace(catalog.NormalizedName))
            {
                return BadRequest();
            }
            if (!string.IsNullOrWhiteSpace(catalog.NormalizedName) && await _context.Catalogs.AnyAsync(x => x.NormalizedName.Equals(catalog.NormalizedName)))
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Normalized name must be unique!"
                }));
            }
            catalog.Active = true;
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            var data = await _context.Catalogs.ToListAsync();
            var total = await _context.Catalogs.CountAsync();
            return Ok(new
            {
                data,
                total
            });
        }

        [HttpGet("tree")]
        public async Task<IActionResult> TreeAsync()
        {
            var returnValue = new List<Tree>();
            var parrent = await _context.Catalogs.Where(x => x.Active && x.ParentId == null).ToListAsync();
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
                returnValue.Add(new Tree { Key = catalog.Id, Title = catalog.Name, Children = children });
            }
            return Ok(returnValue);
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
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child catalog first!"}));
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
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog is null)
            {
                return Ok(IdentityResult.Failed());
            }
            catalog.Active = !catalog.Active;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

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
            catalog.Setting = JsonSerializer.Serialize(model.Setting);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
