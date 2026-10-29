using System.ComponentModel.DataAnnotations;
using Waffle.Entities.Users;

namespace Waffle.Entities;

public class CommentReport : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
    [StringLength(500)]
    public string? Reason { get; set; }
    public DateTime CreatedDate { get; set; }
    public Comment Comment { get; set; } = default!;
    public ApplicationUser User { get; set; } = default!;
}
