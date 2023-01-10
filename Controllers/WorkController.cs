using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.FileContents;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Params;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class WorkController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileContentService _fileContentService;
        private readonly IWorkService _workService;
        private readonly IComponentService _componentService;
        public WorkController(ApplicationDbContext context, IFileContentService fileContentService, IWorkService workContentService, IComponentService componentService)
        {
            _context = context;
            _fileContentService = fileContentService;
            _workService = workContentService;
            _componentService = componentService;
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
                data = await query2.ToListAsync(),
                total = await query2.CountAsync(),
            });
        }

        [HttpPost("child/add")]
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
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await _workService.ActiveAsync(id));

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

            if (await _context.WorkItems.CountAsync(x => x.WorkContentId == model.WorkContentId) == 1)
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

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _workService.DeleteAsync(id));

        [HttpGet("fetch-url")]
        public async Task<IActionResult> FetchUrlAsync([FromQuery] string url)
        {
            using var http = new HttpClient();
            var response = await http.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var html = await response.Content.ReadAsStringAsync();
            }
            return Ok(new {
                success = 1,
                meta = new {
                    title = "",
                    description = "",
                    image = new {
                        url = ""
                    }
                }
            });
        }

        [HttpGet("child/list/{id}")]
        public async Task<IActionResult> GetChildListAsync([FromRoute] Guid id)
        {
            var query = from a in _context.WorkContents
                        join b in _context.Components on a.ComponentId equals b.Id
                        where a.ParentId == id
                        select new WorkListItem { 
                            Id = a.Id,
                            Name = a.Name,
                            NormalizedName = b.NormalizedName,
                        };
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
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
            return Ok(_workService.Get<Navbar>(workContent.Arguments));
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
        public async Task<IActionResult> SaveContactFormAsync([FromBody] ContactForm model) => Ok(await _workService.SaveContactFormAsync(model));

        [HttpGet("row/{id}")]
        public async Task<IActionResult> GetRowAsync([FromRoute] Guid id) => Ok(await _workService.GetRowAsync(id));

        [HttpPost("row/save")]
        public async Task<IActionResult> SaveRowAsync([FromBody] Row row) => Ok(await _workService.SaveRowAsync(row));

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
            var contactForm = _workService.Get<ContactForm>(workContent.Arguments);
            if (contactForm is not null)
            {
                contactForm.Name = workContent.Name;
            }
            return Ok(contactForm);
        }

        [HttpPost("column/add")]
        public async Task<IActionResult> ColumnAddAsync([FromBody] Column column) => Ok(await _workService.ColumnAddAsync(column));

        [HttpGet("column/list/{id}")]
        public async Task<IActionResult> GetColumnListAsync([FromRoute] Guid id)
        {
            var row = await _context.WorkContents.FindAsync(id);
            if (row is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var query = _context.WorkContents.Where(x => x.ParentId == id);
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
        }

        [HttpGet("column/{id}")]
        public async Task<IActionResult> GetColumnAsync([FromRoute] Guid id) => Ok(await _workService.GetColumnAsync(id));

        [HttpPost("column/save")]
        public async Task<IActionResult> SaveColumnAsync([FromBody] Column item) => Ok(await _workService.SaveColumnAsync(item));

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
                swiper = _workService.Get<Swiper>(workContent.Arguments);
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
        public async Task<IActionResult> GetBlockEditorAsync([FromRoute] Guid id) => Ok(await _workService.BlogEditorGetAsync(id));

        [HttpGet("block-editor/fetch-url")]
        public IActionResult BlockEditorFetchUrl([FromQuery] string url)
        {
            return Ok(new
            {
                success = true,
                link = url,
                meta = new
                {
                    title = url,
                }
            });
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

        [HttpPost("card/save")]
        public async Task<IActionResult> SaveCardAsync([FromBody] Card model)
        {
            var workContent = await _context.WorkContents.FindAsync(model.Id);
            if (workContent is null)
            {
                return BadRequest();
            }
            if (model.Image != null)
            {
                if (await _context.FileContents.AnyAsync(x => x.Id == model.Image.Id))
                {
                    await _context.FileItems.AddAsync(new FileItem
                    {
                        FileId = model.Image.Id,
                        ItemId = workContent.Id
                    });
                }
            }
            workContent.Arguments = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("card/{id}")]
        public async Task<IActionResult> GetCardAsync([FromRoute] Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (workContent is null)
            {
                return BadRequest();
            }
            if (!string.IsNullOrEmpty(workContent.Arguments))
            {
                return Ok(_workService.Get<Card>(workContent.Arguments));
            }
            return Ok();
        }

        [HttpPost("lookbook/add")]
        public async Task<IActionResult> AddLookBookAsync([FromBody] WorkContent model)
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
            var image = await _componentService.GetByNameAsync(nameof(Image));
            if (image is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Image component not found!"
                }));
            }
            await _context.WorkContents.AddAsync(new WorkContent
            {
                Active = true,
                ComponentId = image.Id,
                Name = model.Name,
                ParentId = workContent.Id
            });
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpPost("tag/save")]
        public async Task<IActionResult> SaveTagAsync([FromBody] Tag tag) => Ok(await _workService.SaveTagAsync(tag));

        [HttpGet("blogger/{id}")]
        public async Task<IActionResult> BloggerGetAsync([FromRoute] Guid id) => Ok(await _workService.BloggerGetAsync(id));

        [HttpPost("blogger/save")]
        public async Task<IActionResult> BloggerSaveAsync([FromBody] Blogger model) => Ok(await _workService.BloggerSaveAsync(model));

        #endregion
    }
}
