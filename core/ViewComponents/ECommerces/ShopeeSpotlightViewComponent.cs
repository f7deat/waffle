using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models.Components.ECommerces;

namespace Waffle.ViewComponents.ECommerces;

public class ShopeeSpotlightViewComponent : ViewComponent
{
    private readonly IShopeeService _shopeeService;
    private readonly ApplicationDbContext _context;

    public ShopeeSpotlightViewComponent(IShopeeService shopeeService, ApplicationDbContext context)
    {
        _shopeeService = shopeeService;
        _context = context;
    }
    protected Catalog PageData
    {
        get
        {
            RouteData.Values.TryGetValue(nameof(Catalog), out var values);
            return values as Catalog ?? new();
        }
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!await _context.Components.AnyAsync(x => x.NormalizedName == nameof(ShopeeSpotlight) && x.Active)) return View(PartialViewName.Premium);
        var shopee = await _shopeeService.GetLinkListsAsync(PageData.Name, 1, 4);
        shopee.KeyWord = PageData.Name;
        return View("/Pages/Components/Products/ShopeeSpotlight/Default.cshtml", shopee);
    }
}
