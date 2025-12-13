using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Entities.Locations;

namespace Waffle.Controllers.Locations;

public class CountryController(ICountryService _countryService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Country args) => Ok(await _countryService.CreateAsync(args));
}
