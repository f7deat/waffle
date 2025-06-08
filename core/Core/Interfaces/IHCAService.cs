namespace Waffle.Core.Interfaces;

public interface IHCAService
{
    bool IsUserInRole(string roleName);
    IEnumerable<string>? GetRoles();
    bool IsUserInAnyRole(params string[] roles);
    Guid GetUserId();
    string GetUserName();
}
