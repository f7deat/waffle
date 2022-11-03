using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Components;

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
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync() => Ok(await _context.Catalogs.ToListAsync());

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
                return Ok(IdentityResult.Failed());
            }
            if (await _context.Catalogs.AnyAsync(x => x.ParentId == catalog.Id))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child catalog first!"}));
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
    }
}
