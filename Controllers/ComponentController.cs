using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ComponentController : Controller
    {
        private readonly IComponentService _componentService;
        private readonly ApplicationDbContext _context;
        public ComponentController(ApplicationDbContext context, IComponentService componentService)
        {
            _context = context;
            _componentService = componentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _componentService.FindAsync(id));

        [HttpGet("list-all")]
        public async Task<IActionResult> ListAllAsync() => Ok(await _context.Components.Where(x => x.Active).OrderBy(x => x.NormalizedName).ToListAsync());

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _componentService.ListAsync(filterOptions));

        [HttpGet("list-work/{id}")]
        public async Task<IActionResult> ListWorkAsync([FromRoute] Guid id, [FromQuery] WorkFilterOptions filterOptions)
        {
            var query = from a in _context.WorkContents
                        join b in _context.Components on a.ComponentId equals b.Id
                        where b.Id == id
                        orderby a.Id ascending
                        select new WorkListItem
                        {
                            Active = a.Active,
                            Name = a.Name,
                            NormalizedName = b.NormalizedName,
                            Id = a.Id
                        };
            return Ok(await ListResult<WorkListItem>.Success(query, filterOptions));
        }

        [HttpPost("delete/{id}"), Authorize(Roles = RoleName.Admin)]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var component = await _componentService.FindAsync(id);
            if (component is null)
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
            var component = await _componentService.FindAsync(id);
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
