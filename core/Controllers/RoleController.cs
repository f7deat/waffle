using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Entities;
using Waffle.Foundations;
using Waffle.Models;

namespace Waffle.Controllers;

public class RoleController : BaseController
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    public RoleController(RoleManager<ApplicationRole> roleManager)
    {
        _roleManager = roleManager;
    }

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await ListResult<ApplicationRole>.Success(_roleManager.Roles, filterOptions));

    [HttpPost("delete/{name}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] string name)
    {
        var role = await _roleManager.FindByNameAsync(name);
        if (role is null) return BadRequest("Role not found!");
        return Ok(await _roleManager.DeleteAsync(role));
    }

    [HttpPost("create"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] ApplicationRole role) => Ok(await _roleManager.CreateAsync(role));

    [HttpGet("find-by-id/{id}")]
    public async Task<IActionResult> FindByIdAsync([FromRoute] string id) => Ok(await _roleManager.FindByIdAsync(id));
}
