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

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(await _context.Components.ToListAsync());
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
