using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Controllers;

public class CityController(ICityService _cityService) : BaseController
{
    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> GetListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _cityService.GetListAsync(filterOptions));
}
