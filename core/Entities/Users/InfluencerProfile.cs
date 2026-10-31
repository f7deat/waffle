using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Users;

// 1-1 với ApplicationUser, chỉ dành cho role influencer
public class InfluencerProfile
{
    [Key]
    public Guid UserId { get; set; }
    public bool IsOpenForBooking { get; set; }
    [StringLength(256)]
    public string? BookingEmail { get; set; }
    [StringLength(32)]
    public string? BookingPhone { get; set; }
    [StringLength(2058)]
    public string? MediaKitUrl { get; set; }
    [StringLength(256)]
    public string? MediaKitName { get; set; }
    public long? MediaKitSize { get; set; }
    public DateTime? MediaKitUpdatedAt { get; set; }
    public bool ShowEngagementStats { get; set; } = true;

    public ApplicationUser? User { get; set; }
}
