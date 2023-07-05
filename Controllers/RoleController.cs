using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    public class RoleController : BaseController
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        public RoleController(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _roleManager.Roles.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync());

        [HttpPost("delete/{name}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] string name)
        {
            var role = await _roleManager.FindByNameAsync(name);
            return Ok(await _roleManager.DeleteAsync(role));
        }
    }
}
