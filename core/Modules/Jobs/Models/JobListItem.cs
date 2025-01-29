using Waffle.Entities;

namespace Waffle.Modules.Jobs.Models;

public class JobListItem : BaseEntity
{
    public string? JobTitle { get; set; }
    public string? Description { get; set; }
    public string? SalaryRange { get; set; }
    public string? JobLocation { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? Thumbnail { get; set; }
}
