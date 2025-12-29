using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Entities.Users;

namespace Waffle.Data.ContentGenerators;

public class RoleGenerator : BaseGenerator
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public RoleGenerator(ApplicationDbContext context , RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager) : base(context)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    public static IEnumerable<ApplicationRole> GetData()
    {
        var roles = new List<ApplicationRole>
        {
            new() {
                Name = RoleName.Admin
            },
            new()
            {
                Name= RoleName.Member
            }
        };
        return roles;
    }

    public override async Task RunAsync()
    {
        var roles = GetData();
        foreach (var role in roles)
        {
            if (string.IsNullOrEmpty(role.Name) || await _roleManager.RoleExistsAsync(role.Name))
            {
                continue;
            }
            await _roleManager.CreateAsync(role);
        }
        var admin = await _userManager.FindByNameAsync("admin");
        if (admin != null && !await _userManager.IsInRoleAsync(admin, RoleName.Admin))
        {
            await _userManager.AddToRoleAsync(admin, RoleName.Admin);
        }
    }
}
