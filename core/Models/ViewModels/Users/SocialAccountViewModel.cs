namespace Waffle.Models.ViewModels.Users;

public class SocialAccountViewModel
{
    public Guid SocialPlatformId { get; set; }
    public string SocialPlatformName { get; set; } = string.Empty;
    public string? ProfileUrl { get; set; }
    public long? FollowersCount { get; set; }
    public bool IsVerified { get; set; }
}
