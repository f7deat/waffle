using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Entities.Users;
using Waffle.Models;

namespace Waffle.Controllers.Users;

public class RoleController(RoleManager<ApplicationRole> roleManager) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await ListResult<ApplicationRole>.Success(roleManager.Roles, filterOptions));

    [HttpPost("delete/{name}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] string name)
    {
        var role = await roleManager.FindByNameAsync(name);
        if (role is null) return BadRequest("Role not found!");
        return Ok(await roleManager.DeleteAsync(role));
    }

    [HttpPost("create"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] ApplicationRole role) => Ok(await roleManager.CreateAsync(role));

    [HttpGet("find-by-id/{id}")]
    public async Task<IActionResult> FindByIdAsync([FromRoute] string id) => Ok(await roleManager.FindByIdAsync(id));
}
