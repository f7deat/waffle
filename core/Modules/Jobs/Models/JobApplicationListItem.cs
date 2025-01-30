using Waffle.Entities;
using Waffle.Entities.Careers;

namespace Waffle.Modules.Jobs.Models;

public class JobApplicationListItem : BaseEntity
{
    public string? JobTitle { get; set; }
    public Guid JobId { get; set; }
    public DateTime AppliedDate { get; set; }
    public string? CandidateName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Guid CandidateId { get; set; }
    public JobApplicationStatus Status { get; set; }
}
