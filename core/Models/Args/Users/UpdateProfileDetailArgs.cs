using System.ComponentModel.DataAnnotations;

namespace Waffle.Models.Args.Users;

public class UpdateProfileDetailArgs
{
    [Required, StringLength(256)]
    public string? Name { get; set; }
    [Required, StringLength(256)]
    public string? UserName { get; set; }
    [StringLength(256)]
    public string? Tagline { get; set; }
    [StringLength(1024)]
    public string? Bio { get; set; }
    public bool ShowFavoritePlacesOnMap { get; set; }
    public bool NotifyOnComments { get; set; }
    public List<int> ProvinceIds { get; set; } = [];
    public List<string> Tags { get; set; } = [];
    public List<UpdateSocialAccountArgs> SocialAccounts { get; set; } = [];
    // Chỉ được áp dụng khi user có role tương ứng
    public UpdateInfluencerProfileArgs? Influencer { get; set; }
    public UpdateBusinessProfileArgs? Business { get; set; }
}

public class UpdateInfluencerProfileArgs
{
    public bool IsOpenForBooking { get; set; }
    [StringLength(256), EmailAddress]
    public string? BookingEmail { get; set; }
    [StringLength(32)]
    public string? BookingPhone { get; set; }
    public bool ShowEngagementStats { get; set; } = true;
}

public class UpdateBusinessProfileArgs
{
    [StringLength(256)]
    public string? CompanyName { get; set; }
    [StringLength(32)]
    public string? TaxCode { get; set; }
    [StringLength(128)]
    public string? BusinessType { get; set; }
    [StringLength(256)]
    public string? RepresentativeName { get; set; }
    [StringLength(512)]
    public string? Website { get; set; }
    [StringLength(256), EmailAddress]
    public string? ContactEmail { get; set; }
    [StringLength(32)]
    public string? ContactPhone { get; set; }
    [StringLength(512)]
    public string? BusinessAddress { get; set; }
    [StringLength(1024)]
    public string? Description { get; set; }
}
