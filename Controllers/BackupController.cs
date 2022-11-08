using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly ApplicationDbContext _context;
        public BackupController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("export")]
        public async Task<IActionResult> ExportAsync()
        {
            var data = new
            {
                workContents = await _context.WorkContents.ToListAsync(),
                workItems = await _context.WorkItems.ToListAsync(),
                components = await _context.Components.ToListAsync(),
                fileContents = await _context.FileContents.ToListAsync(),
                fileItems = await _context.FileItems.ToListAsync()
            };
            return Ok(data);
        }

        [HttpGet("statistic")]

        public async Task<IActionResult> StatisticAsync()
        {
            var data = new
            {
                workContent = await _context.WorkContents.CountAsync(),
                workItem = await _context.WorkItems.CountAsync(),
                component = await _context.Components.CountAsync(),
                fileContent = await _context.FileContents.CountAsync(),
                fileItem = await _context.FileItems.CountAsync()
            };
            return Ok(data);
        }
    }
}
