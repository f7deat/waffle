using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICatalogService _catalogService;

        public HomeController(ICatalogService catalogService) => _catalogService = catalogService;

        public async Task<IActionResult> Index()
        {
            var catalog = await _catalogService.EnsureDataAsync("home", CatalogType.Entry);
            ViewData["Title"] = catalog.Name;
            ViewData["Desctiption"] = catalog.Description;
            ViewData["Image"] = catalog.Thumbnail;
            return View(await _catalogService.ListComponentAsync(catalog.Id));
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

        [HttpPost]
        public IActionResult Subscribe() => Redirect("/page/thank");

        [Route("/post/{url}-{id}.html")]
        public IActionResult Post(string url, string id)
        {
            return RedirectPermanent($"/article/{url}");
        }
    }
}