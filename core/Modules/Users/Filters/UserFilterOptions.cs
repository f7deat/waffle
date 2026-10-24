using Waffle.Models;

namespace Waffle.Modules.Users.Filters;

public class UserFilterOptions : FilterOptions
{
    public string? UserName { get; set; }
    public string? Name { get; set; }
}
