using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Services.Users.Filters;
using Waffle.Data;
using Waffle.Entities.Users;
using Waffle.Models;

namespace Waffle.Controllers.Users;

public class RoleController(RoleManager<ApplicationRole> _roleManager, ApplicationDbContext _context) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions)
    {
        var query = from r in _context.Roles
                    select new
                    {
                        r.Id,
                        r.Name,
                        r.DisplayName,
                        UserCount = _context.UserRoles.Count(x => x.RoleId == r.Id)
                    };
        return Ok(await ListResult.Success(query, filterOptions));
    }

    [HttpPost("{name}"), Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> DeleteAsync([FromRoute] string name)
    {
        var role = await _roleManager.FindByNameAsync(name);
        if (role is null) return BadRequest("Role not found!");
        return Ok(await _roleManager.DeleteAsync(role));
    }

    [HttpPost, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> CreateAsync([FromBody] ApplicationRole role) => Ok(await _roleManager.CreateAsync(role));

    [HttpGet("find-by-id/{id}")]
    public async Task<IActionResult> FindByIdAsync([FromRoute] string id) => Ok(await _roleManager.FindByIdAsync(id));

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersInRoleAsync([FromQuery] RoleUserFilterOptions filterOptions)
    {
        var query = from u in _context.Users
                    join ur in _context.UserRoles on u.Id equals ur.UserId
                    join r in _context.Roles on ur.RoleId equals r.Id
                    where r.Name == filterOptions.RoleName
                    select new
                    {
                        u.Id,
                        u.UserName,
                        u.Avatar,
                        u.Email,
                        u.EmailConfirmed,
                        u.Name,
                        u.PhoneNumber,
                        u.PhoneNumberConfirmed,
                        u.CreatedAt,
                        u.DateOfBirth,
                        u.Gender,
                        u.Amount,
                        u.DistrictId,
                        u.LockoutEnabled,
                        u.LockoutEnd
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.UserName))
        {
            query = query.Where(u => u.UserName!.ToLower().Contains(filterOptions.UserName.ToLower()));
        }
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(u => u.Name!.ToLower().Contains(filterOptions.Name.ToLower()));
        }
        query = query.OrderByDescending(u => u.CreatedAt);
        return Ok(await ListResult<object>.Success(query, filterOptions));
    }

    [HttpPut, Authorize(Roles = RoleName.Admin)]
    public async Task<IActionResult> UpdateAsync([FromBody] ApplicationRole role)
    {
        var existingRole = await _roleManager.FindByIdAsync(role.Id.ToString());
        if (existingRole is null) return BadRequest("Role not found!");
        existingRole.DisplayName = role.DisplayName;
        return Ok(await _roleManager.UpdateAsync(existingRole));
    }
}
