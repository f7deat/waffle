using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Constants;
using Waffle.Core.Services.Settings;
using Waffle.Data;
using Waffle.Entities.Users;

namespace Waffle.Infrastructure;

public class WebContextSeed
{
    public static async Task SeedAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();
        var scopedServices = scope.ServiceProvider;
        var log = scopedServices.GetRequiredService<ILogger<WebContextSeed>>();
        var roleManager = scopedServices.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scopedServices.GetRequiredService<UserManager<ApplicationUser>>();
        var context = scopedServices.GetRequiredService<ApplicationDbContext>();

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
        
        if (!await context.AppSettings.AnyAsync(x => x.NormalizedName == SettingName.SITE))
        {
            await context.AppSettings.AddAsync(new Entities.AppSetting
            {
                Name = SettingName.SITE,
                NormalizedName = SettingName.SITE,
                Value = JsonSerializer.Serialize(new SiteSetting
                {
                    Name = "Waffle",
                    Logo = "https://api.defzone.net/imgs/logo.png",
                    Title = "Waffle - A blogging platform built with ASP.NET Core",
                    Description = "Waffle is a modern blogging platform built with ASP.NET Core, designed to provide a seamless and efficient blogging experience. With its user-friendly interface and powerful features, Waffle allows bloggers to create and manage their content effortlessly. Whether you're a seasoned blogger or just starting out, Waffle offers the tools you need to share your stories with the world."
                }),
                Description = "Site settings"
            }, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
