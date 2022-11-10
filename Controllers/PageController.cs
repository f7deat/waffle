using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Services.Catalogs;
using Waffle.Data;
using Waffle.Models;

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
                return NotFound("Missing normailized name!");
            }
            var catalog = await _context.Catalogs.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName));
            if (catalog is null)
            {
                return NotFound("Cannot get catalog!");
            }

            var model = await _catalogService.GetPageDataAsync(catalog);

            ViewData["Title"] = model.Settings.Title;
            ViewData["Desctiption"] = model.Description;

            ViewBag.Data = model;

            return View();
        }
    }
}
