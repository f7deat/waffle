using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Params;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class StyleController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ApplicationDbContext _context;
        public StyleController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            var id = Guid.Parse("4473a4f2-e9c0-4db1-9558-fd99c489a3fa");
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog == null)
            {
                return Ok(IdentityResult.Failed());
            }
            var query = from a in _context.WorkContents
                        join b in _context.WorkItems on a.Id equals b.WorkContentId
                        where b.CatalogId == id
                        select a;
            return Ok(new
            {
                data = await query.ToListAsync()
            });
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] AddStyleModel model)
        {
            model.CatalogId = Guid.Parse("4473a4f2-e9c0-4db1-9558-fd99c489a3fa");
            var workContent = new WorkContent
            {
                Active = model.Active,
                Name = model.Name,
                ComponentId = Guid.Parse("1ad3c3f7-d3ec-4a08-884d-4bf72c81afcb")
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

            var path = GetPath(workContent.Id);
            CreateFile(path);
            return CreatedAtAction(nameof(AddAsync), IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkContents.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var path = GetPath(workItem.Id);
            CreateFile(path);
            return Ok(System.IO.File.ReadAllText(GetPath(id)));
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] WorkContent workItem)
        {
            var data = await _context.WorkContents.FindAsync(workItem.Id);
            if (data is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var path = GetPath(workItem.Id);
            CreateFile(path);
            await System.IO.File.WriteAllTextAsync(path, workItem.Arguments);

            return Ok(IdentityResult.Success);
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var data = await _context.WorkContents.FindAsync(id);
            if (data is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var path = GetPath(id);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            _context.WorkContents.Remove(data);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        private static void CreateFile(string path)
        {
            if (!System.IO.File.Exists(path))
            {
                var file = System.IO.File.Create(path);
                file.Close();
            }
        }

        private string GetPath(Guid id) => Path.Combine(_webHostEnvironment.WebRootPath, "css", $"{id}.css");
    }
}
