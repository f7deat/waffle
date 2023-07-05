using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Web;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Wiki
{
    public class DetailModel : PageModel
    {
        private readonly IWikiService _wikiService;
        private readonly ICatalogService _catalogService;
        private readonly IShopeeService _shopeeService;
        public DetailModel(IWikiService wikiService, ICatalogService catalogService, IShopeeService shopeeService)
        {
            _wikiService = wikiService;
            _catalogService = catalogService;
            _shopeeService = shopeeService;
        }

        public Parse Data = new();
        public List<Catalog> Catalogs = new();
        public bool HasArticle = false;
        public LandingPageLinkList ShopeeProducts = new();

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
                Type = CatalogType.Article,
                PageSize = 4
            });
            HasArticle = articles.HasData;
            Catalogs = articles.Data?.ToList() ?? new();

            ShopeeProducts = await _shopeeService.GetLinkListsAsync(id.Replace("_", " "), 6);

            return Page();
        }
    }
}
