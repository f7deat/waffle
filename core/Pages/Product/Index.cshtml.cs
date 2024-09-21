using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Pages.Products
{
    public class IndexModel : EntryPageModel
    {
        private readonly IShopeeService _shopeeService;
        private readonly SettingOptions Options;

        public IndexModel(ICatalogService catalogService, IShopeeService shopeeService, IOptions<SettingOptions> options) : base(catalogService)
        {
            _shopeeService = shopeeService;
            Options = options.Value;
        }

        public ListResult<Catalog>? Categories;
        public BaseInfoAndLinks BaseInfoAndLinks = new();
        public List<ComponentListItem> Components = new();
        public bool IsPremium = false;

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

            return Page();
        }
    }
}
