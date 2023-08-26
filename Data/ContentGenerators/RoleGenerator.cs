using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Data.ContentGenerators;

public class RoleGenerator : BaseGenerator
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    public RoleGenerator(ApplicationDbContext context , RoleManager<ApplicationRole> roleManager) : base(context)
    {
        _roleManager = roleManager;
    }

    public static IEnumerable<ApplicationRole> GetData()
    {
        var roles = new List<ApplicationRole>
        {
            new ApplicationRole
            {
                Name = RoleName.Admin
            }
        };
        return roles;
    }

    public override async Task RunAsync()
    {
        var roles = GetData();
        foreach (var role in roles)
        {
            if (await _roleManager.RoleExistsAsync(role.Name))
            {
                continue;
            }
            await _roleManager.CreateAsync(role);
        }
    }
}
