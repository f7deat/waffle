using Waffle.Core.Helpers;

namespace Waffle.Models.ViewModels.Users;

public class CurrentUserViewModel
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = default!;
    public string? Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public string? EmailConfirmed { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
    public string? Avatar => string.IsNullOrEmpty(Email) ? string.Empty : $"https://www.gravatar.com/avatar/{EncryptHelper.MD5Create(Email)}?s=520";
    public string? Name { get; set; }
}
