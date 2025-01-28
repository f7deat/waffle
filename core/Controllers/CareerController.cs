using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Careers;

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
}
