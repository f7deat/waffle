using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Careers;

public class JobApplication : BaseEntity
{
    public Guid CandidateId { get; set; }
    [ForeignKey(nameof(JobOpportunity))]
    public Guid JobId { get; set; }
    public DateTime AppliedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public JobApplicationStatus Status { get; set; }
    public string? ResumeFile { get; set; }

    public JobOpportunity? JobOpportunity { get; set; }
}

public enum JobApplicationStatus
{
    Pending,
    Approved,
    Rejected
}