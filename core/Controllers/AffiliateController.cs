using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Affliates;
using Waffle.Foundations;
using Waffle.Models.Filters.Affiliates;

namespace Waffle.Controllers;

public class AffiliateController(IAffiliateService _affiliateService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] AffiliateFilterOptions filterOptions) => Ok(await _affiliateService.ListAsync(filterOptions));

    [HttpPost("add-link")]
    public async Task<IActionResult> AddLinkAsync([FromBody] AffiliateLink args)
    {
        var result = await _affiliateService.AddLinkAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("delete-link/{id}")]
    public async Task<IActionResult> DeleteLinkAsync([FromRoute] Guid id)
    {
        var result = await _affiliateService.DeleteLinkAsync(id);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }
}
