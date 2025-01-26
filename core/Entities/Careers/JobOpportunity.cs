using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Careers;

public class JobOpportunity : BaseEntity
{
    [StringLength(256)]
    public string JobTitle { get; set; } = default!;
    public string? JobDescription { get; set; }
    [StringLength(256)]
    public string? JobRequirements { get; set; }
    [StringLength(256)]
    public string? SalaryRange { get; set; }
    [StringLength(256)]
    public string? JobLocation { get; set; }
    public JobType JobType { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid? ModifiedBy { get; set; }

    public ICollection<JobApplication>? JobApplications { get; set; }
}

public enum JobType
{
    FullTime,
    PartTime,
    Contract,
    Internship
}