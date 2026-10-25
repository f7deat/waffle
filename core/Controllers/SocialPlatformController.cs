using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Services.Users.Interfaces;

namespace Waffle.Controllers;

public class SocialPlatformController(ISocialPlatformService socialPlatformService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync()
    {
        var data = await socialPlatformService.ListAsync();
        return Ok(new { data, total = data.Count, success = true });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id)
    {
        var platform = await socialPlatformService.GetAsync(id);
        return platform is null ? NotFound() : Ok(platform);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] SocialPlatformArgs? args)
    {
        if (args is null) return BadRequest("Request body is required.");
        if (!TryValidateArgs(args, out var error)) return BadRequest(error);

        var code = args.Code.Trim();
        if (await socialPlatformService.CodeExistsAsync(code)) return Conflict("A social platform with this code already exists.");

        var platform = await socialPlatformService.CreateAsync(code, args.Name.Trim(), args.IsActive);
        return Ok(platform);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] SocialPlatformArgs? args)
    {
        if (args is null) return BadRequest("Request body is required.");
        if (!TryValidateArgs(args, out var error)) return BadRequest(error);

        if (await socialPlatformService.GetAsync(id) is null) return NotFound();

        var code = args.Code.Trim();
        if (await socialPlatformService.CodeExistsAsync(code, id)) return Conflict("A social platform with this code already exists.");

        var platform = await socialPlatformService.UpdateAsync(id, code, args.Name.Trim(), args.IsActive);
        return platform is null ? NotFound() : Ok(platform);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var result = await socialPlatformService.DeleteAsync(id);
        return result switch
        {
            SocialPlatformDeleteResult.Deleted => Ok(new { succeeded = true }),
            SocialPlatformDeleteResult.InUse => Conflict("This social platform is assigned to one or more accounts."),
            _ => NotFound()
        };
    }

    private static bool TryValidateArgs(SocialPlatformArgs args, out string error)
    {
        if (string.IsNullOrWhiteSpace(args.Code) || args.Code.Trim().Length > 40)
        {
            error = "Code is required and must not exceed 40 characters.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(args.Name) || args.Name.Trim().Length > 100)
        {
            error = "Name is required and must not exceed 100 characters.";
            return false;
        }

        error = string.Empty;
        return true;
    }
}

public class SocialPlatformArgs
{
    [Required]
    [StringLength(40)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
