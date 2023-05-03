using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Web;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Pages.Wiki
{
    public class DetailModel : PageModel
    {
        private readonly IWikiService _wikiService;
        private readonly ICatalogService _catalogService;
        public DetailModel(IWikiService wikiService, ICatalogService catalogService)
        {
            _wikiService = wikiService;
            _catalogService = catalogService;
        }

        public Parse Data = new();
        public List<Catalog> Catalogs = new();
        public bool HasArticle = false;

        public async Task<IActionResult> OnGetAsync(string id, string lang = "vi")
        {
            var response = await _wikiService.ParseAsync(id, lang);
            if (response is null)
            {
                return Redirect($"/search?searchTerm={HttpUtility.UrlEncode(id)}");
            }
            Data = response;
            ViewData["Title"] = Data.Title;
            ViewData["Description"] = Data.Title;

            var articles = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Name = Data.Title,
                Type = CatalogType.Article
            });
            HasArticle = articles.HasData;
            Catalogs = articles.Data?.ToList() ?? new();

            return Page();
        }
    }
}
