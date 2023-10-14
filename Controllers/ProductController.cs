using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Foundations;
using Waffle.Models;
using Waffle.Models.Params.Products;

namespace Waffle.Controllers;

public class ProductController : BaseController
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    private readonly IProductService _productService;
    private readonly ILogService _appLogService;

    public ProductController(ICatalogService catalogService, IWorkService workService, IProductService productService, ILogService appLogService)
    {
        _catalogService = catalogService;
        _workService = workService;
        _productService = productService;
        _appLogService = appLogService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _productService.GetByCatalogIdAsync(id));

    [HttpGet("count")]
    public async Task<IActionResult> CountAsync() => Ok(await _productService.CountAsync());

    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] Product args)
    {
        var catalog  = await _catalogService.FindAsync(args.CatalogId);
        if (catalog is null) return BadRequest("Catalog not found!");
        if (args.Price != null && args.Price < 1) return BadRequest("Price is not valid!");
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
        if (args is null || !args.Any())
        {
            return View(PartialViewName.Empty, new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
        foreach (var item in args)
        {
            item.Catalog = await _catalogService.FindAsync(item.ProductId);
            item.Product = await _productService.GetByCatalogIdAsync(item.ProductId);
        }
        if ("checkout".Equals(type))
        {
            return View("/Pages/Products/Checkout/_Products.cshtml", args);
        }
        return View("/Pages/Products/Cart/_Products.cshtml", args);
    }

    [HttpPost("brand/save")]
    public async Task<IActionResult> SaveBrandAsync([FromBody] SaveBrandModel args) => Ok(await _productService.SaveBrandAsync(args));
}
