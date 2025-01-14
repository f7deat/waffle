using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class CityController(ICityService _cityService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _cityService.GetListAsync(filterOptions));
}
