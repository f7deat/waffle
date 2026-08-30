using Waffle.Models;

namespace Waffle.Core.Services.HR.Filters;

public class DepartmentSelectOptions : SelectOptions
{
    public int? BranchId { get; set; }
}
