using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.AppSettings;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Shopee;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Shop
{
    public class IndexModel : PageModel
    {
        private readonly ICatalogService _catalogService;
        private readonly IShopeeService _shopeeService;

        public IndexModel(ICatalogService catalogService, IShopeeService shopeeService)
        {
            _catalogService = catalogService;
            Shop = new Catalog();
            Products = new List<Catalog>();
            _shopeeService = shopeeService;
        }

        public IEnumerable<Catalog> Products;
        public Catalog Shop;
        public ListResult<Catalog>? Categories;
        public bool HasProduct;
        public BaseInfoAndLinks BaseInfoAndLinks = new();

        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        public Pagination Pagination => new()
        {
            HasNextPage = BaseInfoAndLinks.LandingPageLinkList.TotalCount > Current * 20,
            HasPrevPage = Current > 1,
            NextPageUrl = $"/shop?current={Current + 1}",
            PrevPageUrl = $"/shop?current={Current - 1}",
        };

        public async Task<IActionResult> OnGetAsync()
        {
            Shop = await _catalogService.EnsureDataAsync(nameof(Shop), CatalogType.Entry);
            ViewData["Title"] = Shop.Name; 
            ViewData["Description"] = Shop.Description;

            var catalog = await _catalogService.ListAsync(new CatalogFilterOptions
            {
                Active = true,
                Type = CatalogType.Product,
                PageSize = 4
            });
            Products = catalog.Data ?? new List<Catalog>();

            HasProduct = Products.Any();

            BaseInfoAndLinks = await _shopeeService.GetBaseInfoAndLinksAsync(Current);

            return Page();
        }
    }
}
