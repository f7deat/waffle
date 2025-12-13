using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;

namespace Waffle.Controllers.Locations;

public class DistrictController(IDistrictService _districtService) : BaseController
{
    [HttpGet("options")]
    public async Task<IActionResult> GetOptionsAsync([FromQuery] DistrictSelectOptions filterOptions) => Ok(await _districtService.GetOptionsAsync(filterOptions));

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] District args) => Ok(await _districtService.CreateAsync(args));
}
