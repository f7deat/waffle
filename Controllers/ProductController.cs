using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Params.Products;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers;

public class ProductController : BaseController
{
    private readonly ICatalogService _catalogService;
    private readonly IWorkService _workService;
    public ProductController(ICatalogService catalogService, IWorkService workService)
    {
        _catalogService = catalogService;
        _workService = workService;
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

    [HttpPost("add")]
    public IActionResult AddAsync([FromBody] ProductItem args)
    {
        return Ok(IdentityResult.Success);
    }

    [HttpGet("image/{id}")]
    public async Task<IActionResult> GetProductImageAsync([FromRoute] Guid id) => Ok(await _catalogService.GetProductImageAsync(id));

    [HttpPost("image/save")]
    public async Task<IActionResult> AddImageAsync([FromBody] SaveImageModel args) => Ok(await _workService.SaveProductImageAsync(args));
}
