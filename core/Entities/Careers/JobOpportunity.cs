using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Careers;

public class JobOpportunity : BaseEntity
{
    [StringLength(256)]
    public string Title { get; set; } = default!;
    [StringLength(256)]
    public string NormalizedName { get; set; } = default!;
    [StringLength(512)]
    public string? Description { get; set; }
    [StringLength(256)]
    public string? JobRequirements { get; set; }
    public string? JobDetail { get; set; }
    [StringLength(256)]
    public string? SalaryRange { get; set; }
    [StringLength(256)]
    public string? JobLocation { get; set; }
    public JobType JobType { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid? ModifiedBy { get; set; }
    public int ViewCount { get; set; }
    public JobStatus Status { get; set; }

    public ICollection<JobApplication>? JobApplications { get; set; }
}

public enum JobType
{
    FullTime,
    PartTime,
    Contract,
    Internship
}

public enum JobStatus
{
    Draft,
    Open,
    Closed,
    Filled
}