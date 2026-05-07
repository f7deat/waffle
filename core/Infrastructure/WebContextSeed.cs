using Microsoft.AspNetCore.Identity;
using Waffle.Core.Constants;
using Waffle.Entities.Users;

namespace Waffle.Infrastructure;

public class WebContextSeed
{
    public static void Seed(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var scopedServices = scope.ServiceProvider;
        var roleManager = scopedServices.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scopedServices.GetRequiredService<UserManager<ApplicationUser>>();

        var roles = new[] { RoleName.Admin, RoleName.Member, RoleName.Influencer };
        foreach (var roleName in roles)
        {
            if (!roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult())
            {
                var roleResult = roleManager.CreateAsync(new ApplicationRole
                {
                    Name = roleName,
                    DisplayName = roleName
                }).GetAwaiter().GetResult();

                if (!roleResult.Succeeded)
                {
                    var roleError = roleResult.Errors.FirstOrDefault()?.Description ?? $"Cannot create role '{roleName}'.";
                    throw new InvalidOperationException(roleError);
                }
            }
        }

        const string adminUserName = "admin";
        const string adminEmail = "admin@defzone.net";
        const string adminPassword = "Defzone@2026";

        var adminUser = userManager.FindByNameAsync(adminUserName).GetAwaiter().GetResult();
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminUserName,
                Email = adminEmail,
                EmailConfirmed = true,
                Name = "Đinh Công Tân",
                CreatedAt = DateTime.UtcNow
            };

            var userResult = userManager.CreateAsync(adminUser, adminPassword).GetAwaiter().GetResult();
            if (!userResult.Succeeded)
            {
                var userError = userResult.Errors.FirstOrDefault()?.Description ?? "Cannot create default admin user.";
                throw new InvalidOperationException(userError);
            }
        }

        if (!userManager.IsInRoleAsync(adminUser, RoleName.Admin).GetAwaiter().GetResult())
        {
            var addRoleResult = userManager.AddToRoleAsync(adminUser, RoleName.Admin).GetAwaiter().GetResult();
            if (!addRoleResult.Succeeded)
            {
                var addRoleError = addRoleResult.Errors.FirstOrDefault()?.Description ?? "Cannot assign admin role to default user.";
                throw new InvalidOperationException(addRoleError);
            }
        }
    }

    public static async Task SeedAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var scopedServices = scope.ServiceProvider;
        var log = scopedServices.GetRequiredService<ILogger<WebContextSeed>>();
        var roleManager = scopedServices.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scopedServices.GetRequiredService<UserManager<ApplicationUser>>();

        log.LogTrace("Context Seed is runing!");

        var roles = new[] { RoleName.Admin, RoleName.Member, RoleName.Influencer };
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var roleResult = await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = roleName,
                    DisplayName = roleName
                });

                if (!roleResult.Succeeded)
                {
                    var roleError = roleResult.Errors.FirstOrDefault()?.Description ?? $"Cannot create role '{roleName}'.";
                    throw new InvalidOperationException(roleError);
                }
            }
        }

        const string adminUserName = "admin";
        const string adminEmail = "admin@defzone.net";
        const string adminPassword = "Defzone@2026";

        var adminUser = await userManager.FindByNameAsync(adminUserName);
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminUserName,
                Email = adminEmail,
                EmailConfirmed = true,
                Name = "Đinh Công Tân",
                CreatedAt = DateTime.UtcNow
            };

            var userResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (!userResult.Succeeded)
            {
                var userError = userResult.Errors.FirstOrDefault()?.Description ?? "Cannot create default admin user.";
                throw new InvalidOperationException(userError);
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, RoleName.Admin))
        {
            var addRoleResult = await userManager.AddToRoleAsync(adminUser, RoleName.Admin);
            if (!addRoleResult.Succeeded)
            {
                var addRoleError = addRoleResult.Errors.FirstOrDefault()?.Description ?? "Cannot assign admin role to default user.";
                throw new InvalidOperationException(addRoleError);
            }
        }
    }
}
