using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.IServices.Locations;
using Waffle.Core.Services.Locations.Filters;

namespace Waffle.Controllers.Locations;

public class PlaceController(IPlaceService _placeService) : BaseController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id) => Ok(await _placeService.GetByIdAsync(id));

    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] PlaceFilterOptions filterOptions) => Ok(await _placeService.ListAsync(filterOptions));
}
