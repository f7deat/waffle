using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class CatalogController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CatalogController(ApplicationDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAsync([FromBody] Catalog catalog)
        {
            await _context.Catalogs.AddAsync(catalog);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(await _context.Catalogs.ToListAsync());
        }
    }
}
