using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

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
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(await _context.Catalogs.ToListAsync());
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog is null)
            {
                return Ok(IdentityResult.Failed());
            }
            if ("home".Equals(catalog.NormalizedName))
            {
                return Ok(IdentityResult.Failed());
            }
            _context.Catalogs.Remove(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
