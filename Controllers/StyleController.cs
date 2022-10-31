using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

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
            return Ok(await _context.WorkItems.Where(x => x.CatalogId == id).ToListAsync());
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] WorkItem workItem)
        {
            workItem.CatalogId = Guid.Parse("4473a4f2-e9c0-4db1-9558-fd99c489a3fa");
            workItem.ComponentId = Guid.Parse("1ad3c3f7-d3ec-4a08-884d-4bf72c81afcb");
            await _context.WorkItems.AddAsync(workItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddAsync), IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id)
        {
            var workItem = await _context.WorkItems.FindAsync(id);
            if (workItem is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var path = Path.Combine(_webHostEnvironment.WebRootPath, "css", $"{workItem.Id}.css");
            if (!System.IO.File.Exists(path))
            {
                System.IO.File.Create(path);
            }
            return Ok(System.IO.File.ReadAllText(path));
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveAsync([FromBody] WorkItem workItem)
        {
            var data = await _context.WorkItems.FindAsync(workItem.Id);
            if (data is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var path = Path.Combine(_webHostEnvironment.WebRootPath, "css", $"{workItem.Id}.css");
            if (!System.IO.File.Exists(path))
            {
                System.IO.File.Create(path);
            }
            await System.IO.File.WriteAllTextAsync(path, workItem.Arguments);
            return Ok(IdentityResult.Success);
        }
    }
}
