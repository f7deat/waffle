using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Careers;

public class InfluencerJob : BaseEntity
{
    [StringLength(256)]
    public string? Title { get; set; }
    [StringLength(2000)]
    public string? Description { get; set; }
    public decimal Budget { get; set; }
    public decimal? BudgetMax { get; set; }
    public InfluencerJobContentType ContentType { get; set; }
    [StringLength(256)]
    public string? Category { get; set; }
    public DateTime? Deadline { get; set; }
    public int? RequiredFollowers { get; set; }
    [StringLength(256)]
    public string? Brand { get; set; }
    public InfluencerJobStatus Status { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public Guid? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }

    public ICollection<InfluencerJobApplication>? Applications { get; set; }
}

public class InfluencerJobApplication : BaseEntity
{
    public Guid JobId { get; set; }
    public Guid InfluencerId { get; set; }
    public DateTime AppliedDate { get; set; }
    [StringLength(1000)]
    public string? Message { get; set; }
    public InfluencerJobApplicationStatus Status { get; set; }

    public InfluencerJob? Job { get; set; }
}

public enum InfluencerJobContentType
{
    Photo,
    Video,
    Story,
    Reel,
    Mixed
}

public enum InfluencerJobStatus
{
    Open,
    InProgress,
    Completed,
    Cancelled
}

public enum InfluencerJobApplicationStatus
{
    Pending,
    Approved,
    Rejected
}
