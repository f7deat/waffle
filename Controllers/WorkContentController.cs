using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Web;
using Waffle.Core.Services.FileContents;
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
        private readonly IFileContentService _fileContentService;
        public WorkContentController(ApplicationDbContext context, IFileContentService fileContentService)
        {
            _context = context;
            _fileContentService = fileContentService;
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

        [HttpGet("list-child/{id}")]
        public async Task<IActionResult> ListChildAsync([FromRoute] Guid id)
        {
            var query = from a in _context.WorkContents
                        join b in _context.Components on a.ComponentId equals b.Id
                        where a.ParentId == id
                        select new WorkListItem
                        {
                            Id = a.Id,
                            Name = a.Name,
                            NormalizedName = b.NormalizedName,
                            Arguments = a.Arguments
                        };
            return Ok(new
            {
                data = await query.ToListAsync()
            });
        }

        [HttpPost("add-child")]
        public async Task<IActionResult> AddChildAsync([FromBody] WorkContent workContent)
        {
            if (workContent is null)
            {
                return BadRequest();
            }
            if (!await _context.WorkContents.AnyAsync(x => x.Id == workContent.ParentId))
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Parrent component not found!"
                }));
            }
            await _context.WorkContents.AddAsync(workContent);
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
            workContent.Arguments = model.Arguments;
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

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteAsync([FromBody] DeleteWorkContent model)
        {
            var workItem = await _context.WorkItems.FirstOrDefaultAsync(x => x.WorkContentId == model.WorkContentId && x.CatalogId == model.CatalogId);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work item not found!"
                }));
            }

            if (await _context.WorkContents.AnyAsync(x => x.ParentId == model.WorkContentId))
            {
                return Ok(IdentityResult.Failed(new IdentityError { Description = "Please remove child items first!" }));
            }

            if (await _context.WorkItems.CountAsync(x => x.CatalogId == model.CatalogId) == 1)
            {
                var workContent = await _context.WorkContents.FindAsync(model.WorkContentId);
                if (workContent is null)
                {
                    return Ok(IdentityResult.Failed(new IdentityError
                    {
                        Description = "No work content found!"
                    }));
                }
                _context.WorkContents.Remove(workContent);
            }

            _context.WorkItems.Remove(workItem);

            await _fileContentService.RemoveFromItemAsync(workItem.WorkContentId);

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        #region Custom components

        [HttpGet("navbar/{id}")]
        public async Task<IActionResult> GetNavbarAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return NotFound();
            }
            if (string.IsNullOrEmpty(workContent.Arguments))
            {
                return NoContent();
            }
            return Ok(JsonSerializer.Deserialize<Navbar>(workContent.Arguments));
        }

        [HttpPost("navbar/save")]
        public async Task<IActionResult> SaveNavbarAsync([FromBody] Navbar model)
        {
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "No work content found!"
                }));
            }
            workContent.Arguments = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
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

        [HttpPost("contact-form/save")]
        public async Task<IActionResult> SaveContactFormAsync([FromBody] ContactForm contactForm)
        {
            if (contactForm is null)
            {
                return BadRequest();
            }
            var workContent = await _context.WorkContents.FindAsync(contactForm.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work content not found!"
                }));
            }
            workContent.Arguments = JsonSerializer.Serialize(contactForm);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("contact-form/{id}")]
        public async Task<IActionResult> GetContactFormAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return BadRequest();
            }
            if (string.IsNullOrEmpty(workContent.Arguments))
            {
                return Ok();
            }
            return Ok(JsonSerializer.Deserialize<ContactForm>(workContent.Arguments));
        }

        [HttpPost("column/add")]
        public async Task<IActionResult> AddColumnAsync([FromBody] Column column)
        {
            if (column is null)
            {
                return BadRequest();
            }
            var row = await _context.WorkContents.FindAsync(column.ParentId);
            if (row is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Row not found!"
                }));
            }

            var component = await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Column)));
            if (component is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Component column not found!"
                }));
            }

            var workContent = new WorkContent
            {
                Active = true,
                Arguments = column.Arguments,
                Name = column.Name,
                ComponentId = component.Id,
                ParentId = row.Id
            };

            await _context.WorkContents.AddAsync(workContent);

            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }

        #endregion
    }
}
