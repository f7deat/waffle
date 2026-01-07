using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;

namespace Waffle.Controllers.Locations;

public class ProvinceController(IProvinceService _provinceService) : BaseController
{
    [HttpGet("options"), AllowAnonymous]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] ProvinceSelectOptions selecOptions) => Ok(await _provinceService.GetOptionsAsync(selecOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Province args) => Ok(await _provinceService.CreateAsync(args));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> GetListAsync([FromQuery] ProvinceFilterOptions filterOptions) => Ok(await _provinceService.GetListAsync(filterOptions));

    [HttpGet("{id}"), AllowAnonymous]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _provinceService.GetByIdAsync(id));
}
