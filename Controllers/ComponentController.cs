using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Models;

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Components.FindAsync(id));

        [HttpGet("list-all")]
        public async Task<IActionResult> ListAllAsync() => Ok(await _context.Components.Where(x => x.Active).OrderBy(x => x.NormalizedName).ToListAsync());

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync() => Ok(new
        {
            data = await _context.Components.ToListAsync(),
            total = await _context.Components.CountAsync()
        });

        [HttpGet("list-work/{id}")]
        public async Task<IActionResult> ListWorkAsync([FromRoute] Guid id, [FromQuery] WorkFilterOptions filterOptions)
        {
            var query = from a in _context.WorkContents
                        join b in _context.Components on a.ComponentId equals b.Id
                        where b.Id == id
                        select new WorkListItem
                        {
                            Active = a.Active,
                            Name = a.Name,
                            NormalizedName = b.NormalizedName,
                            Id = a.Id
                        };
            return Ok(new
            {
                data = await query.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync(),
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
