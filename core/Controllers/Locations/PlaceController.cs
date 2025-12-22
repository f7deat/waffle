using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;

namespace Waffle.Controllers.Locations;

public class PlaceController(IPlaceService _placeService) : BaseController
{
    [HttpGet("details/{id}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id) => Ok(await _placeService.GetByIdAsync(id));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] PlaceFilterOptions filterOptions) => Ok(await _placeService.ListAsync(filterOptions));

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromBody] PlaceUpdateArgs args) => Ok(await _placeService.UpdateAsync(args));

    [HttpGet("{normalizedName}"), AllowAnonymous]
    public async Task<IActionResult> GetByNormalizedNameAsync([FromRoute] string normalizedName) => Ok(await _placeService.GetByNormalizedNameAsync(normalizedName));

    [HttpGet("random"), AllowAnonymous]
    public async Task<IActionResult> GetRandomAsync([FromQuery] PlaceFilterOptions filterOptions) => Ok(await _placeService.GetRandomAsync(filterOptions));
}
