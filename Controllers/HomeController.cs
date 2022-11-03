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
            var items = from a in _context.WorkContents
                        join b in _context.WorkItems on a.Id equals b.WorkContentId
                        join c in _context.Components on a.ComponentId equals c.Id
                        where b.CatalogId == catalog.Id
                        orderby b.SortOrder ascending
                        select new ComponentListItem
                        {
                            Name = c.NormalizedName,
                            Id = a.Id
                        };
            ViewBag.AT = items;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}