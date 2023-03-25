using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Pages.Shop
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IFacebookService _facebookService;
        private readonly IAppSettingService _appService;

        public IndexModel(ICatalogService catalogService, IFacebookService facebookService, IAppSettingService appSettingService)
        {
            _catalogService = catalogService;
            Shop = new Catalog();
            Products = new List<Catalog>();
            _facebookService = facebookService;
            _appService = appSettingService;
        }

        public IEnumerable<Catalog> Products;
        public Catalog Shop;
        public FacebookListResult<FacebookProduct> FacebookProducts = new();
        public ListResult<Catalog>? Categories;

        public async Task<IActionResult> OnGetAsync()
        {
            Shop = await _catalogService.EnsureDataAsync(nameof(Shop), CatalogType.Entry);
            ViewData["Title"] = Shop.Name; 
            ViewData["Description"] = Shop.Description;

            var catalog = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Shop
            });
            Products = catalog.Data ?? new List<Catalog>();

            var app = await _appService.GetAsync<Facebook>(nameof(Facebook));
            if (app != null)
            {
                FacebookProducts = await _facebookService.GetProductsAsync("243943267914049", app.PageAccessToken, 4);
            }

            Categories = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Current = 1,
                Type = CatalogType.Tag
            });

            return Page();
        }
    }
}
