using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Data.ContentGenerators;
using Waffle.Entities;

namespace Waffle.Controllers;

[Route("install")]
public class InstallController : Controller
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ApplicationDbContext _context;
    private readonly IEnumerable<IGenerator> _generators;
    public InstallController(RoleManager<ApplicationRole> roleManager, ApplicationDbContext context, IEnumerable<IGenerator> generators)
    {
        _roleManager = roleManager;
        _context = context;
        _generators = generators;
    }

    [HttpGet, AllowAnonymous]
    public async Task<IActionResult> RunAsync()
    {

        foreach (var generator in _generators)
        {
            await generator.RunAsync();
        }

        #region Roles
        //var role = new RoleGenerator(_context, _roleManager);
        //await role.RunAsync();
        #endregion

        //var leaf = new LeafGenerator(_context);
        //await leaf.RunAsync();

        //var component = new ComponentGenerator(_context);
        //await component.RunAsync();

        return Ok(IdentityResult.Success);
    }
}
