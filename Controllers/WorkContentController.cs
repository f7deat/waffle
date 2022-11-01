using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Web;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Params;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class WorkContentController : Controller
    {
        private readonly ApplicationDbContext _context;
        public WorkContentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] AddWorkContentModel model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var workContent = new WorkContent
            {
                Name = model.Name,
                ComponentId = model.ComponentId,
                Active = true
            };
            await _context.WorkContents.AddAsync(workContent);
            await _context.SaveChangesAsync();

            var workItem = new WorkItem
            {
                CatalogId = model.CatalogId,
                WorkContentId = workContent.Id
            };

            await _context.WorkItems.AddAsync(workItem);
            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.WorkContents.FindAsync(id));

        [HttpGet("list/{id}")]
        public async Task<IActionResult> ListAsync([FromRoute] Guid id)
        {
            var query = from a in _context.Catalogs
                        join b in _context.WorkItems on a.Id equals b.CatalogId
                        join c in _context.WorkContents on b.WorkContentId equals c.Id
                        join d in _context.Components on c.ComponentId equals d.Id
                        where a.Id == id
                        orderby b.SortOrder ascending
                        select new WorkListItem
                        {
                            Id = c.Id,
                            Name = $"[{d.Name}] {c.Name}",
                            NormalizedName = d.NormalizedName
                        };
            return Ok(new
            {
                data = await query.ToListAsync()
            });
        }

        [HttpPost("save/title")]
        public async Task<IActionResult> SaveTitleAsync([FromBody] UpdateTitleOption model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var title = await _context.WorkContents.FindAsync(model.WorkId);
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
        public async Task<IActionResult> SaveAsync([FromBody] SaveWorkContentModel model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed());
            }
            workContent.Arguments = HttpUtility.HtmlEncode(model.Arguments);
            workContent.Active = model.Active;
            workContent.Name = model.Name;

            var workItem = await _context.WorkItems.FirstOrDefaultAsync(x => x.WorkContentId == model.Id && x.CatalogId == model.CatalogId);
            if (workItem != null)
            {
                workItem.SortOrder = model.SortOrder;
            }

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkContents.FindAsync(id);
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
            var workItem = await _context.WorkContents.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            if (await _context.WorkContents.AnyAsync(x => x.ParentId == id))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child items first!" }));
            }
            _context.WorkContents.Remove(workItem);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
