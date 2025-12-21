using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;

namespace Waffle.Controllers.Locations;

public class StreetController(IStreetService _streetService) : BaseController
{
    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> GetListAsync([FromQuery] StreetFilterOptions filterOptions) => Ok(await _streetService.GetListAsync(filterOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Street args) => Ok(await _streetService.CreateAsync(args));

    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] StreetSelectOptions selectOptions) => Ok(await _streetService.GetOptionsAsync(selectOptions));
}
