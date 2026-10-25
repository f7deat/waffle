using Waffle.Entities.Commons;

namespace Waffle.Core.Services.Users.Interfaces;

public interface ISocialPlatformService
{
    Task<List<SocialPlatform>> ListAsync();
    Task<SocialPlatform?> GetAsync(Guid id);
    Task<bool> CodeExistsAsync(string code, Guid? exceptId = null);
    Task<SocialPlatform> CreateAsync(string code, string name, bool isActive);
    Task<SocialPlatform?> UpdateAsync(Guid id, string code, string name, bool isActive);
    Task<SocialPlatformDeleteResult> DeleteAsync(Guid id);
}

public enum SocialPlatformDeleteResult
{
    NotFound,
    InUse,
    Deleted
}
