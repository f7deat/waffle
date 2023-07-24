using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Data.ContentGenerators;
using Waffle.Entities;

namespace Waffle.Controllers;

[Route("install")]
public class InstallController : Controller
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IGenerator _generator;
    public InstallController(RoleManager<ApplicationRole> roleManager, ApplicationDbContext context)
    {
        _roleManager = roleManager;
        _generator = Activator.CreateInstance(typeof(LeafGenerator), args: context) as IGenerator;
    }

    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> EnsureDataAsync()
    {
        await _generator.RunAsync();
        return Ok(IdentityResult.Success);
    }
}
