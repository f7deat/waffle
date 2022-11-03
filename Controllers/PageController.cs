using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models;

namespace Waffle.Controllers
{
    public class PageController : Controller
    {
        private readonly ApplicationDbContext _context;
        public PageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Route("{normalizedName}")]
        public async Task<IActionResult> Index(string normalizedName)
        {
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return NotFound();
            }
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName));
            if (catalog is null)
            {
                return NotFound();
            }

            ViewData["Title"] = catalog.Name;
            ViewData["Desctiption"] = catalog.Description;

            var workItems = from a in _context.WorkItems
                            join b in _context.WorkContents on a.WorkContentId equals b.Id
                            join c in _context.Components on b.ComponentId equals c.Id
                            where a.CatalogId == catalog.Id
                            orderby a.SortOrder ascending
                            select new ComponentListItem
                            {
                                Id = a.WorkContentId,
                                Name = c.NormalizedName
                            };

            var page = new PageVewModel
            {
                ComponentListItems = await workItems.ToListAsync(),
                Settings = JsonSerializer.Deserialize<PageSettingViewModel>(catalog.Setting) ?? new PageSettingViewModel()
            };

            return View(page);
        }
    }
}
