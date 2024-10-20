using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Core.Services;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Pages.Products
{
    public class IndexModel : EntryPageModel
    {
        private readonly IShopeeService _shopeeService;
        private readonly IProductService _productService;
        private readonly SettingOptions Options;
        private readonly ILocalizationService _localizationService;

        public IndexModel(ICatalogService catalogService, IShopeeService shopeeService, IOptions<SettingOptions> options, IProductService productService, ILocalizationService localizationService) : base(catalogService)
        {
            _shopeeService = shopeeService;
            Options = options.Value;
            _productService = productService;
            _localizationService = localizationService;
        }

        public ListResult<Catalog>? Categories;
        public BaseInfoAndLinks BaseInfoAndLinks = new();
        public List<ComponentListItem> Components = new();
        public bool IsPremium = false;
        public string? SearchPlaceHolder { get; set; }
        public IEnumerable<ProductListItem> Products { get; set; } = new List<ProductListItem>();

        [BindProperty(SupportsGet = true)]
        public int Current { get; set; } = 1;
        public Pagination Pagination => new()
        {
            NextPageUrl = $"/shop?current={Current + 1}",
            PrevPageUrl = $"/shop?current={Current - 1}",
        };

        public async Task<IActionResult> OnGetAsync()
        {
            BaseInfoAndLinks = await _shopeeService.GetBaseInfoAndLinksAsync(Current);

            Components = await _catalogService.ListComponentAsync(PageData.Id);
            IsPremium = Options.Theme == "Default";
            var products = await _productService.ListAsync(new ProductFilterOptions
            {
                Current = 1,
                PageSize = 12,
                Active = true,
                Locale = PageData.Locale
            });
            Products = products.Data;
            SearchPlaceHolder = await _localizationService.GetAsync(nameof(SearchPlaceHolder));

            return Page();
        }
    }
}
