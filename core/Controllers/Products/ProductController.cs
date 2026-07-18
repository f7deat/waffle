using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Models;
using Waffle.Core.IServices.Shops;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Controllers.Products;

public class ProductController(IProductService _productService) : BaseController
{
    [HttpGet("by-name/{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName) => Ok(await _productService.GetByNameAsync(normalizedName));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Product args) => Ok(await _productService.CreateAsync(args));

    [HttpGet("count")]
    public async Task<IActionResult> CountAsync() => Ok(TResult.Ok(await _productService.CountAsync()));

    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] Product args) => Ok(await _productService.SaveAsync(args));

    [HttpGet("{id}")]
    public async Task<IActionResult> DetailAsync([FromRoute] Guid id) => Ok(await _productService.DetailAsync(id));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _productService.DeleteAsync(id));

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

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] ProductFilterOptions filterOptions) => Ok(await _productService.ListAsync(filterOptions));
}
