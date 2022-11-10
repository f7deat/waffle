using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Waffle.Core.Services.Catalogs;
using Waffle.Data;
using Waffle.Models;

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

            ViewData["Title"] = model.Settings.Title;
            ViewData["Desctiption"] = model.Description;

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