using Waffle.Models;

namespace Waffle.Core.Services.HR.Filters;

public class TeamFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public int? DepartmentId { get; set; }
}
