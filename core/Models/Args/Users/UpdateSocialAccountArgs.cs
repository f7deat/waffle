using System.ComponentModel.DataAnnotations;

namespace Waffle.Models.Args.Users;

public class UpdateSocialAccountArgs
{
    [Required]
    public Guid SocialPlatformId { get; set; }

    [Required]
    [StringLength(1000)]
    public string ProfileUrl { get; set; } = string.Empty;

    [Range(0, long.MaxValue)]
    public long? FollowersCount { get; set; }

    public bool IsVerified { get; set; }
}
