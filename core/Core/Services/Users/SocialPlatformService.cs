using Microsoft.EntityFrameworkCore;
using Waffle.Core.Services.Users.Interfaces;
using Waffle.Data;
using Waffle.Entities.Commons;

namespace Waffle.Core.Services.Users;

public class SocialPlatformService(ApplicationDbContext context) : ISocialPlatformService
{
    public Task<List<SocialPlatform>> ListAsync() => context.SocialPlatforms
        .AsNoTracking()
        .OrderBy(platform => platform.Name)
        .ToListAsync();

    public Task<SocialPlatform?> GetAsync(Guid id) => context.SocialPlatforms
        .AsNoTracking()
        .FirstOrDefaultAsync(platform => platform.Id == id);

    public Task<bool> CodeExistsAsync(string code, Guid? exceptId = null) => context.SocialPlatforms
        .AnyAsync(platform => platform.Code == code && (!exceptId.HasValue || platform.Id != exceptId.Value));

    public async Task<SocialPlatform> CreateAsync(string code, string name, bool isActive)
    {
        var platform = new SocialPlatform
        {
            Code = code,
            Name = name,
            IsActive = isActive
        };
        context.SocialPlatforms.Add(platform);
        await context.SaveChangesAsync();
        return platform;
    }

    public async Task<SocialPlatform?> UpdateAsync(Guid id, string code, string name, bool isActive)
    {
        var platform = await context.SocialPlatforms.FindAsync(id);
        if (platform is null) return null;

        platform.Code = code;
        platform.Name = name;
        platform.IsActive = isActive;
        await context.SaveChangesAsync();
        return platform;
    }

    public async Task<SocialPlatformDeleteResult> DeleteAsync(Guid id)
    {
        var platform = await context.SocialPlatforms.FindAsync(id);
        if (platform is null) return SocialPlatformDeleteResult.NotFound;

        if (await context.SocialAccounts.AnyAsync(account => account.SocialPlatformId == id))
        {
            return SocialPlatformDeleteResult.InUse;
        }

        context.SocialPlatforms.Remove(platform);
        await context.SaveChangesAsync();
        return SocialPlatformDeleteResult.Deleted;
    }
}
