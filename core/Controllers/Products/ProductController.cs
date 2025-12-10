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

public class ProductController(ICatalogService _catalogService, IWorkService workService, IProductService _productService) : BaseController
{
    private readonly IWorkService _workService = workService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _productService.GetByCatalogIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Catalog args, [FromQuery] string locale) => Ok(await _productService.CreateAsync(args, locale));

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
            var result = await _productService.GetByCatalogIdAsync(item.ProductId);
            item.Product = result.Data;
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
    public async Task<IActionResult> OptionsAsync([FromQuery] SelectOptions selectOptions) => Ok(await _productService.OptionsAsync(selectOptions));

    [HttpGet("new-arrivals"), AllowAnonymous]
    public async Task<IActionResult> NewArrivalsAsync([FromQuery] ProductFilterOptions filterOptions) => Ok(await _productService.NewArrivalsAsync(filterOptions));
}
