using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Data.ContentGenerators;
using Waffle.Entities;

namespace Waffle.Controllers;

public class InstallController : BaseController
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    public InstallController(RoleManager<ApplicationRole> roleManager)
    {
        _roleManager = roleManager;
    }

    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> EnsureDataAsync()
    {
        await EnsureUsersAsync();
        return Ok(IdentityResult.Success);
    }

    private static async Task EnsureUsersAsync()
    {
        var userGenerator = new UserGenerator();
        await userGenerator.EnsureUsersAsync();
    }
}
