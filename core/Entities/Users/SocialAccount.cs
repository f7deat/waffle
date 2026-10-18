using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Waffle.Entities.Commons;

namespace Waffle.Entities.Users;

public class SocialAccount : BaseEntity
{
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    [ForeignKey(nameof(SocialPlatform))]
    public Guid SocialPlatformId { get; set; }
    [StringLength(1000)]
    public string? ProfileUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long? FollowersCount { get; set; }
    public bool IsVerified { get; set; }

    public ApplicationUser? User { get; set; }
    public SocialPlatform? SocialPlatform { get; set; }
}
