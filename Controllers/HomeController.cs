using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Waffle.Data;
using Waffle.Models;

namespace Waffle.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName == "home");
            if (catalog is null)
            {
                catalog = new Entities.Catalog
                {
                    Name = "Home",
                    NormalizedName = "home"
                };
                await _context.Catalogs.AddAsync(catalog);
                await _context.SaveChangesAsync();
            }
            var items = from a in _context.WorkItems
                        join b in _context.Components on a.ComponentId equals b.Id
                        select new ComponentListItem
                        {
                            Name = b.Name,
                            Id = a.Id,
                            Arguments = a.Arguments
                        };
            return View(items);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}