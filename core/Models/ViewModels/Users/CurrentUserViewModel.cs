namespace Waffle.Models.ViewModels.Users;

public class CurrentUserViewModel
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = default!;
    public string? Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public bool? EmailConfirmed { get; set; }
    public IList<string> Roles { get; set; } = [];
    public string? Avatar { get; set; }
    public string? Name { get; set; }
}
