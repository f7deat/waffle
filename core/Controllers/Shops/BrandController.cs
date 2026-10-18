using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Brands;
using Waffle.Models.ViewModels.Brands;

namespace Waffle.Controllers.Shops;

public class BrandController(IBrandService brandService) : BaseController
{
    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] BrandFilterOptions filterOptions)
        => Ok(await brandService.ListAsync(filterOptions, activeOnly: true));

    [HttpGet("admin/list"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> AdminListAsync([FromQuery] BrandFilterOptions filterOptions)
        => Ok(await brandService.ListAsync(filterOptions, activeOnly: false));

    [HttpGet("options"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> OptionsAsync([FromQuery] string? keyWords)
        => Ok(await brandService.OptionsAsync(keyWords));

    [HttpGet("detail/{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNameAsync([FromRoute] string normalizedName)
        => Ok(await brandService.GetByNameAsync(normalizedName));

    [HttpPost, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] SaveBrandRequest request)
        => Ok(await brandService.CreateAsync(request));

    [HttpPut, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> UpdateAsync([FromBody] SaveBrandRequest request)
        => Ok(await brandService.UpdateAsync(request));

    [HttpDelete("{id:int}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        => Ok(await brandService.DeleteAsync(id));
}
