using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Shopee;
using Waffle.Models;

namespace Waffle.Pages.Shop
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IFacebookService _facebookService;
        private readonly IAppSettingService _appService;
        private readonly IShopeeService _shopeeService;

        public IndexModel(ICatalogService catalogService, IFacebookService facebookService, IAppSettingService appSettingService, IShopeeService shopeeService)
        {
            _catalogService = catalogService;
            Shop = new Catalog();
            Products = new List<Catalog>();
            _facebookService = facebookService;
            _appService = appSettingService;
            _shopeeService = shopeeService;
        }

        public IEnumerable<Catalog> Products;
        public Catalog Shop;
        public FacebookListResult<FacebookProduct> FacebookProducts = new();
        public ListResult<Catalog>? Categories;
        public bool HasProduct;
        public BaseInfoAndLinks BaseInfoAndLinks = new();

        public async Task<IActionResult> OnGetAsync()
        {
            Shop = await _catalogService.EnsureDataAsync(nameof(Shop), CatalogType.Entry);
            ViewData["Title"] = Shop.Name; 
            ViewData["Description"] = Shop.Description;

            var catalog = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Shop,
                PageSize = 4
            });
            Products = catalog.Data ?? new List<Catalog>();

            var app = await _appService.GetAsync<Facebook>(nameof(Facebook));
            if (app != null)
            {
                FacebookProducts = await _facebookService.GetProductsAsync("243943267914049", app.PageAccessToken, 4);
            }
            HasProduct = Products.Any();

            BaseInfoAndLinks = await _shopeeService.GetBaseInfoAndLinksAsync();

            return Page();
        }
    }
}
