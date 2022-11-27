﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
        public async Task<IActionResult> ListAsync([FromRoute] Guid id, [FromQuery] bool child = false)
        {
            if (child)
            {
                var query1 = from a in _context.WorkContents
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
                    data = await query1.ToListAsync()
                });
            }
            var query2 = from a in _context.Catalogs
                        join b in _context.WorkItems on a.Id equals b.CatalogId
                        join c in _context.WorkContents on b.WorkContentId equals c.Id
                        join d in _context.Components on c.ComponentId equals d.Id
                        where a.Id == id
                        orderby b.SortOrder ascending
                        select new WorkListItem
                        {
                            Id = c.Id,
                            Name = $"[{d.Name}] {c.Name}",
                            NormalizedName = d.NormalizedName,
                            SortOrder = b.SortOrder,
                            CatalogId = b.CatalogId
                        };
            return Ok(new
            {
                data = await query2.ToListAsync()
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
        public async Task<IActionResult> SaveAsync([FromBody] WorkContent model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work content not found!"
                }));
            }
            workContent.Arguments = model.Arguments;
            workContent.Active = model.Active;
            workContent.Name = model.Name;

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkContents.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work item not found!"
                }));
            }
            workItem.Active = !workItem.Active;
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("sort-order")]
        public async Task<IActionResult> SortOrderAsync([FromBody] WorkItem model)
        {
            var workItem = await _context.WorkItems.FirstOrDefaultAsync(x => x.WorkContentId == model.WorkContentId && x.CatalogId == model.CatalogId);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work item not found!"
                }));
            }
            workItem.SortOrder = model.SortOrder;
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
            workContent.Name = contactForm.Name;
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
            var contactForm = JsonSerializer.Deserialize<ContactForm>(workContent.Arguments);
            if (contactForm is not null)
            {
                contactForm.Name = workContent.Name;
            }
            return Ok(contactForm);
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

        [HttpGet("swiper/{id}")]
        public async Task<IActionResult> GetSwiperAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return BadRequest();
            }
            var swiper = new Swiper();
            if (!string.IsNullOrEmpty(workContent.Arguments))
            {
                swiper = JsonSerializer.Deserialize<Swiper>(workContent.Arguments);
            }
            if (swiper is not null)
            {
                swiper.Name = workContent.Name;
            }
            return Ok(swiper);
        }

        [HttpPost("swiper/add-image")]
        public async Task<IActionResult> AddImageSync([FromBody] AddSwiperItem model)
        {
            var swiper = await _context.WorkContents.FindAsync(model.Id);
            if (swiper is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Work content not found!"
                }));
            }
            var component = await _context.Components.FirstAsync(x => x.NormalizedName.Equals(nameof(Image)));

            await _context.WorkContents.AddAsync(new WorkContent
            {
                ParentId = swiper.Id,
                Active = true,
                ComponentId = component.Id,
                Name = model.Name,
            });

            await _context.SaveChangesAsync();

            return Ok(IdentityResult.Success);
        }

        [HttpGet("block-editor/{id}")]
        public async Task<IActionResult> GetBlockEditorAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null || string.IsNullOrEmpty(workContent.Arguments))
            {
                return Ok();
            }
            return Ok(JsonSerializer.Deserialize<List<BlockEditorBlock>>(workContent.Arguments));
        }

        [HttpPost("block-editor/save")]
        public async Task<IActionResult> SaveBlockEditorAsync([FromBody] BlockEditor model)
        {
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return BadRequest();
            }
            workContent.Arguments = JsonSerializer.Serialize(model.Blocks);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        #endregion
    }
}
