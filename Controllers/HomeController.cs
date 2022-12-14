using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Text.Json;
using Waffle.Core.Interfaces.IServices;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Layout;

namespace Waffle.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly ICatalogService _catalogService;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, ICatalogService catalogService)
        {
            _logger = logger;
            _context = context;
            _catalogService = catalogService;
        }

        public async Task<IActionResult> Index()
        {
            var catalog = await _catalogService.EnsureDataAsync("home");

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

            ViewBag.AT = model.ComponentListItems;

            return View(model);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}