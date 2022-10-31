using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Web;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class WorkItemController : Controller
    {
        private readonly ApplicationDbContext _context;
        public WorkItemController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] WorkItem workItem)
        {
            if (workItem is null)
            {
                return BadRequest();
            }
            await _context.WorkItems.AddAsync(workItem);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.WorkItems.FindAsync(id));

        [HttpGet("list/{id}")]
        public async Task<IActionResult> ListAsync([FromRoute] Guid id)
        {
            var query = from a in _context.Catalogs
                        join b in _context.WorkItems on a.Id equals b.CatalogId
                        join c in _context.Components on b.ComponentId equals c.Id
                        where a.Id == id
                        orderby b.SortOrder ascending
                        select new WorkListItem
                        {
                            WorkId = b.Id,
                            Name = $"[{c.Name}] {b.Name}",
                            NormalizedName = c.NormalizedName
                        };
            return Ok(await query.ToListAsync());
        }

        [HttpPost("save/title")]
        public async Task<IActionResult> SaveTitleAsync([FromBody] UpdateTitleOption model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var title = await _context.WorkItems.FindAsync(model.WorkId);
            if (title is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var option = new Title
            {
                Label = model.Label
            };
            var args = JsonSerializer.Serialize(option);
            title.Arguments = args;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] WorkItem model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var workItem = await _context.WorkItems.FindAsync(model.Id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            workItem.Arguments = HttpUtility.HtmlEncode(model.Arguments);
            workItem.Active = model.Active;
            workItem.Name = model.Name;
            workItem.SortOrder = model.SortOrder;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkItems.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            workItem.Active = !workItem.Active;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkItems.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            if (await _context.WorkItems.AnyAsync(x => x.ParentId == id))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child items first!" }));
            }
            _context.WorkItems.Remove(workItem);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
