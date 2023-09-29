using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers;

public class ProductController : BaseController
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    private readonly IProductService _productService;
    private readonly IAppLogService _appLogService;

    public ProductController(ICatalogService catalogService, IWorkService workService, IProductService productService, IAppLogService appLogService)
    {
        _catalogService = catalogService;
        _workService = workService;
        _productService = productService;
        _appLogService = appLogService;
    }

    private readonly List<ProductItem> Products = new();

    [HttpGet("list")]
    public IActionResult List()
    {
        return Ok(new
        {
            data = Products
        });
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] Product args)
    {
        var catalog  = await _catalogService.FindAsync(args.CatalogId);
        if (catalog is null) return BadRequest("Catalog not found!");
        await _appLogService.AddAsync($"Update product: {JsonSerializer.Serialize(args)}", args.CatalogId);
        return Ok(await _productService.SaveAsync(args));
    }

    [HttpGet("image/{id}")]
    public async Task<IActionResult> GetProductImageAsync([FromRoute] Guid id) => Ok(await _catalogService.GetProductImageAsync(id));

    [HttpPost("image/save")]
    public async Task<IActionResult> AddImageAsync([FromBody] SaveImageModel args) => Ok(await _workService.SaveProductImageAsync(args));

    [HttpPost("cart-items/{type}"), AllowAnonymous]
    public async Task<IActionResult> GetCartItemsAsync([FromRoute] string type, [FromBody] List<CartItem> args)
    {
        foreach (var item in args)
        {
            item.Product = await _catalogService.FindAsync(item.ProductId);
        }
        if ("checkout".Equals(type))
        {
            return View("/Pages/Products/Checkout/_Products.cshtml", args);
        }
        return View("/Pages/Products/Cart/_Products.cshtml", args);
    }
}
