using System.Security.Claims;
using Waffle.Core.Foundations.Interfaces;

namespace Waffle.Core.Services;

public class HCAService(IHttpContextAccessor _httpContextAccessor) : IHCAService
{
    public IEnumerable<string>? GetRoles()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user is null || user.Identity is null) return default;

        return user.FindAll(ClaimTypes.Role).Select(x => x.Value);
    }

    public bool IsUserInRole(string roleName)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user is null || user.Identity is null) return false;

        return user.IsInRole(roleName);
    }

    public bool IsUserInAnyRole(params string[] roles)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user == null || user.Identity is null) return false;

        return roles.Any(user.IsInRole);
    }

    public Guid GetUserId()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        var claimValue = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claimValue) || !Guid.TryParse(claimValue, out var userId)) return Guid.Empty;
        return userId;
    }

    public string GetUserName()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user?.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
    }
}