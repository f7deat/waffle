using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Careers;
using Waffle.Entities.Users;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Modules.Jobs.Models;

namespace Waffle.Controllers;

public class CareerController(IJobOpportunityService _jobOpportunityService, IWebHostEnvironment _webHostEnvironment, UserManager<ApplicationUser> _userManager, ILogService _logService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> AddAsync([FromBody] JobOpportunity args) => Ok(await _jobOpportunityService.AddAsync(args));

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromBody] JobOpportunity args) => Ok(await _jobOpportunityService.UpdateAsync(args));

    [HttpPost("apply"), AllowAnonymous]
    public async Task<IActionResult> ApplyAsync(JobApplication args, IFormFile? resumeFile)
    {
        try
        {
            if (User.Identity?.IsAuthenticated == false) return Redirect("/user/login");
            if (resumeFile is null) return BadRequest("Resume file is required.");
            var user = await _userManager.FindByIdAsync(User.GetId().ToString());
            if (user is null || string.IsNullOrEmpty(user.UserName)) return BadRequest("User not found.");
            var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "resumes", user.UserName);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            using var fileStream = new FileStream(Path.Combine(folderPath, resumeFile.FileName), FileMode.Create);
            await resumeFile.CopyToAsync(fileStream);
            args.ResumeFile = $"https://{Request.Host.Value}/uploads/resumes/{user.UserName}/{resumeFile.FileName}";
            var result = await _jobOpportunityService.ApplyAsync(args);
            if (!result.Succeeded) return BadRequest(result.Message);
            return Redirect("/career/thank");
        }
        catch (Exception ex)
        {
            await _logService.ExceptionAsync(ex);
            return Redirect("/career/thank");
        }
    }

    [HttpGet("list-opportunity")]
    public async Task<IActionResult> ListOpportunityAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _jobOpportunityService.ListAsync(filterOptions));

    [HttpGet("list-application")]
    public async Task<IActionResult> ListApplicationAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _jobOpportunityService.ListApplicationAsync(filterOptions));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _jobOpportunityService.DeleteAsync(id));

    [HttpPost("delete-application/{id}")]
    public async Task<IActionResult> DeleteApplicationAsync([FromRoute] Guid id)
    {
        var result = await _jobOpportunityService.DeleteApplicationAsync(id);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }

    [HttpPut("application/{id}/status")]
    public async Task<IActionResult> UpdateApplicationStatusAsync([FromRoute] Guid id, [FromBody] JobApplicationStatusUpdateArgs args) => Ok(await _jobOpportunityService.UpdateApplicationStatusAsync(id, args.Status));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id) => Ok(await _jobOpportunityService.GetByIdAsync(id));
}
