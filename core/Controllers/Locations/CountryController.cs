using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Controllers.Locations;

public class CountryController(ICountryService _countryService) : BaseController
{
    [HttpPost, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] Country args) => Ok(await _countryService.CreateAsync(args));

    [HttpPut, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> UpdateAsync([FromBody] Country args) => Ok(await _countryService.UpdateAsync(args));

    [HttpDelete("{id}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync(int id) => Ok(await _countryService.DeleteAsync(id));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> GetListAsync([FromQuery] FilterOptions filterOptions) => Ok(await _countryService.GetListAsync(filterOptions));

    [HttpGet("{id}"), AllowAnonymous]
    public async Task<IActionResult> GetByIdAsync(int id) => Ok(await _countryService.GetByIdAsync(id));
}
