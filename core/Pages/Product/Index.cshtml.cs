using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Pages.Product;

public class IndexModel(ICatalogService catalogService, IShopeeService _shopeeService, IOptions<SettingOptions> options, IProductService _productService, ILocalizationService _localizationService) : EntryPageModel(catalogService)
{
    private readonly SettingOptions Options = options.Value;
    public ListResult<Catalog>? Categories;
    public BaseInfoAndLinks BaseInfoAndLinks = new();
    public List<ComponentListItem> Components = new();
    public bool IsPremium = false;
    public string Theme = "Default";

    public string? SearchPlaceHolder { get; set; }
    public ListResult<ProductListItem>? Products { get; set; }

    [BindProperty(SupportsGet = true)]
    public int Current { get; set; } = 1;

    public async Task OnGetAsync()
    {
        BaseInfoAndLinks = await _shopeeService.GetBaseInfoAndLinksAsync(Current);

        Components = await _catalogService.ListComponentAsync(PageData.Id);
        IsPremium = Options.Theme == "Default";
        Theme = Options.Theme;
        Products = await _productService.ListAsync(new ProductFilterOptions
        {
            Current = Current,
            PageSize = 12,
            Active = true,
            Locale = PageData.Locale
        });
        SearchPlaceHolder = await _localizationService.GetAsync(nameof(SearchPlaceHolder));
    }
}
