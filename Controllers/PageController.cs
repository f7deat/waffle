using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Layout;

namespace Waffle.Controllers
{
    public class PageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;
        public PageController(ApplicationDbContext context, ICatalogService catalogService)
        {
            _context = context;
            _catalogService = catalogService;
        }

        [Route("/page/{normalizedName}")]
        public async Task<IActionResult> Index(string normalizedName)
        {
            if (string.IsNullOrWhiteSpace(normalizedName))
            {
                return NotFound();
            }
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName));
            if (catalog is null)
            {
                return NoContent();
            }

            var model = await _catalogService.GetPageDataAsync(catalog);

            var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Head)));
            var titleSuffix = string.Empty;
            if (setting is not null && !string.IsNullOrEmpty(setting.Value))
            {
                var head = JsonSerializer.Deserialize<Head>(setting.Value);
                if (head is not null)
                {
                    titleSuffix = " - " + head.TitleSuffix;
                }
            }
            ViewData["Title"] = model.Settings.Title + titleSuffix;

            ViewData["Desctiption"] = model.Description;
            ViewData["NormalizedName"] = catalog.NormalizedName;

            ViewBag.Data = model;

            catalog.ViewCount++;

            await _context.SaveChangesAsync();

            return View();
        }
    }
}
