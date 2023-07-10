using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
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
        public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions)
        {
            return Ok(new
            {
                total = await _roleManager.Roles.CountAsync(),
                data = await _roleManager.Roles.Skip((filterOptions.Current - 1) * filterOptions.PageSize).Take(filterOptions.PageSize).ToListAsync()
            });
        }

        [HttpPost("delete/{name}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] string name)
        {
            var role = await _roleManager.FindByNameAsync(name);
            return Ok(await _roleManager.DeleteAsync(role));
        }

        [HttpPost("create"), Authorize(Roles = RoleName.Admin)]
        public async Task<IActionResult> CreateAsync([FromBody] ApplicationRole role) => Ok(await _roleManager.CreateAsync(role));

        [HttpPost("update")]
        public async Task<IActionResult> UpdateAsync([FromBody] ApplicationRole args)
        {
            var role = await _roleManager.FindByIdAsync(args.Id.ToString());
            if (role is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Code = "dataNotFound",
                    Description = "Data not found!"
                }));
            }
            role.Name = args.Name;
            return Ok(await _roleManager.UpdateAsync(role));
        }
    }
}
