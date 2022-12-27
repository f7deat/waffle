using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ComponentController : Controller
    {

        private readonly ApplicationDbContext _context;
        public ComponentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("list-all")]
        public async Task<IActionResult> ListAllAsync() => Ok(await _context.Components.Where(x => x.Active).OrderBy(x => x.NormalizedName).ToListAsync());

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync() => Ok(new
        {
            data = await _context.Components.ToListAsync(),
            total = await _context.Components.CountAsync()
        });

        [HttpGet("list-work/{id}")]
        public async Task<IActionResult> ListWorkAsync([FromRoute] Guid id)
        {
            var query = _context.WorkContents.Where(x => x.ComponentId == id);
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var component = await _context.Components.FindAsync(id);
            if (component == null)
            {
                return BadRequest();
            }
            if (await _context.WorkContents.AnyAsync(x => x.ComponentId == id))
            {
                return Ok(IdentityResult.Failed());
            }
            _context.Components.Remove(component);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> DraftAsync([FromRoute] Guid id)
        {
            var component = await _context.Components.FindAsync(id);
            if (component is null)
            {
                return Ok(IdentityResult.Failed());
            }
            component.Active = !component.Active;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
