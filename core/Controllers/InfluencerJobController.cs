using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Careers;
using Waffle.Extensions;
using Waffle.Models;

namespace Waffle.Controllers;

[Route("api/influencer-job")]
public class InfluencerJobController(IInfluencerJobService _influencerJobService) : BaseController
{
    [HttpGet("list"), AllowAnonymous]
    public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions)
        => Ok(await _influencerJobService.ListAsync(filterOptions));

    [HttpGet("{id}"), AllowAnonymous]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id)
    {
        var job = await _influencerJobService.GetAsync(id);
        if (job is null) return NotFound();
        return Ok(new { data = job });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] InfluencerJob args)
    {
        var userId = User.GetId();
        var result = await _influencerJobService.CreateAsync(args, userId);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] InfluencerJob args)
    {
        var userId = User.GetId();
        var result = await _influencerJobService.UpdateAsync(args, userId);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var result = await _influencerJobService.DeleteAsync(id);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("apply/{id}")]
    public async Task<IActionResult> ApplyAsync([FromRoute] Guid id, [FromBody] ApplyJobModel args)
    {
        var userId = User.GetId();
        var result = await _influencerJobService.ApplyAsync(id, userId, args.Message);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpGet("{id}/applications")]
    public async Task<IActionResult> ListApplicationsAsync([FromRoute] Guid id, [FromQuery] BasicFilterOptions filterOptions)
        => Ok(await _influencerJobService.ListApplicationsAsync(id, filterOptions));

    [HttpGet("my-applications")]
    public async Task<IActionResult> MyApplicationsAsync([FromQuery] BasicFilterOptions filterOptions)
    {
        var userId = User.GetId();
        return Ok(await _influencerJobService.ListMyApplicationsAsync(userId, filterOptions));
    }
}

public record ApplyJobModel(string? Message);
