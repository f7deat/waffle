using Waffle.Models;

namespace Waffle.Core.Services.HR.Filters;

public class TeamSelectOptions : SelectOptions
{
    public int? DepartmentId { get; set; }
}
