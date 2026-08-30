using Waffle.Models;

namespace Waffle.Core.Services.HR.Filters;

public class DepartmentFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public int? BranchId { get; set; }
}
