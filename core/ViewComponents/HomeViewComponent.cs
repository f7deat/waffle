using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components.Pages;
using Waffle.Core.Options;
using Microsoft.Extensions.Options;
using Waffle.Models;
using Waffle.Core.IServices.Shops;

namespace Waffle.ViewComponents;

public class HomeViewComponent : ViewComponent
{
    private readonly ApplicationDbContext _context;
    private readonly IWorkService _workService;
    private readonly SettingOptions Options;
    private readonly IProductService _productService;
    public HomeViewComponent(ApplicationDbContext context, IWorkService workService, IOptions<SettingOptions> options, IProductService productService)
    {
        _context = context;
        _workService = workService;
        Options = options.Value;
        _productService = productService;
    }

    public async Task<IViewComponentResult> InvokeAsync(Guid workId)
    {
        var home = await _workService.GetAsync<Home>(workId);
        home ??= new Home();
        var products = await _productService.ListAsync(new ProductFilterOptions
        {
            Current = 1,
            PageSize = 12,
            Active = true,
            Locale = "vi-VN"
        });
        home.Products = products.Data;
        
        return View(Options.Theme, home);
    }
}
