using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Careers;
using Waffle.Models;

namespace Waffle.Controllers;

public class CareerController(IJobOpportunityService _jobOpportunityService) : BaseController
{
    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] JobOpportunity args)
    {
        var result = await _jobOpportunityService.SaveAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPost("apply"), AllowAnonymous]
    public async Task<IActionResult> ApplyAsync([FromBody] JobApplication args)
    {
        if (User.Identity?.IsAuthenticated == false) return Redirect("/user/login");
        var result = await _jobOpportunityService.ApplyAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Redirect("/career/thank");
    }

    [HttpGet("list-application")]
    public async Task<IActionResult> ListApplicationAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _jobOpportunityService.ListApplicationAsync(filterOptions));

    [HttpPost("delete-application/{id}")]
    public async Task<IActionResult> DeleteApplicationAsync([FromRoute] Guid id)
    {
        var result = await _jobOpportunityService.DeleteApplicationAsync(id);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }
}
