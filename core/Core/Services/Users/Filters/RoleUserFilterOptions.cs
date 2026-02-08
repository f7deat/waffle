using Waffle.Models;

namespace Waffle.Core.Services.Users.Filters;

public class RoleUserFilterOptions : FilterOptions
{
    public string RoleName { get; set; } = default!;
    public string? UserName { get; set; }
    public string? Name { get; set; }
}
