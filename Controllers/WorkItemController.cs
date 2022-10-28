using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
            var entity = await _context.WorkItems.AddAsync(workItem);
            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpGet("list/{id}")]
        public async Task<IActionResult> ListAsync([FromRoute] Guid id)
        {
            var query = from a in _context.Catalogs
                        join b in _context.WorkItems on a.Id equals b.CatalogId
                        join c in _context.Components on b.ComponentId equals c.Id
                        where a.Id == id
                        select new WorkListItem
                        {
                            Id = b.Id,
                            Name = c.Name
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
            var option = new TitleOption
            {
                Label = model.Label
            };
            var args = JsonSerializer.Serialize(option);
            var title = await _context.WorkItems.FindAsync(model.WorkId);
            if (title is null)
            {
                return Ok(IdentityResult.Failed());
            }
            title.Arguments = args;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
