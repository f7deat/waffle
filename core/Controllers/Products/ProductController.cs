using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.Params.Products;
using Waffle.Models.Result;

namespace Waffle.Controllers.Products;

public class ProductController(ICatalogService catalogService, IWorkService workService, IProductService productService, ILogService appLogService) : BaseController
{
    private readonly ICatalogService _catalogService = catalogService;
    private readonly IWorkService _workService = workService;
    private readonly IProductService _productService = productService;
    private readonly ILogService _appLogService = appLogService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _productService.GetByCatalogIdAsync(id));

    [HttpGet("count")]
    public async Task<IActionResult> CountAsync() => Ok(DefResult.Ok(await _productService.CountAsync()));

    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] Product args)
    {
        var catalog  = await _catalogService.FindAsync(args.CatalogId);
        if (catalog is null) return BadRequest("Catalog not found!");
        if (args.Price != null && args.Price < 1) return BadRequest("Price is not valid!");
        return Ok(await _productService.SaveAsync(args));
    }

    [HttpGet("image/{id}")]
    public async Task<IActionResult> GetProductImageAsync([FromRoute] Guid id) => Ok(await _catalogService.GetProductImageAsync(id));

    [HttpPost("image/save")]
    public async Task<IActionResult> AddImageAsync([FromBody] SaveImageModel args) => Ok(await _workService.SaveProductImageAsync(args));

    [HttpPost("cart-items/{type}"), AllowAnonymous]
    public async Task<IActionResult> GetCartItemsAsync([FromRoute] string type, [FromBody] List<CartItem> args)
    {
        if (args is null || args.Count == 0)
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
            return View($"/Pages/{CatalogType.Product}/Checkout/_Products.cshtml", args);
        }
        return View($"/Pages/{CatalogType.Product}/Cart/_Products.cshtml", args);
    }

    [HttpPost("brand/save")]
    public async Task<IActionResult> SaveBrandAsync([FromBody] SaveBrandModel args) => Ok(await _productService.SaveBrandAsync(args));

    [HttpPost("add-link")]
    public async Task<IActionResult> AddLinkAsync([FromBody] ProductLink args) => Ok(await _productService.AddLinkAsync(args));

    [HttpPost("delete-link/{id}")]
    public async Task<IActionResult> DeleteLinkAsync([FromRoute] Guid id) => Ok(await _productService.DeleteLinkAsync(id));

    [HttpGet("list-link/{id}")]
    public async Task<IActionResult> ListLinkByProductIdAsync([FromRoute] Guid id)
    {
        var data = await _productService.GetLinksAsync(id);
        return Ok(new { data, total = data.Count() });
    }

    [HttpPost("go-to-product-link/{id}"), AllowAnonymous]
    public async Task<IActionResult> GoToProductLinkAsync([FromRoute] Guid id) => Ok(await _productService.GoToProductLinkAsync(id));

    [HttpGet("options")]
    public async Task<IActionResult> OptionsAsync() => Ok(await _productService.OptionsAsync());
}
