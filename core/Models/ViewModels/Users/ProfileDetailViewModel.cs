namespace Waffle.Models.ViewModels.Users;

public class ProfileDetailViewModel
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Avatar { get; set; }
    public string? CoverImage { get; set; }
    public string? Tagline { get; set; }
    public string? Bio { get; set; }
    public bool ShowFavoritePlacesOnMap { get; set; }
    public bool NotifyOnComments { get; set; }
    public string? ProvinceName { get; set; }
    public IList<string> Roles { get; set; } = [];
    public int Completeness { get; set; }
    public List<ProfileAreaViewModel> ActivityAreas { get; set; } = [];
    public List<ProfileTagViewModel> Tags { get; set; } = [];
    public List<SocialAccountViewModel> SocialAccounts { get; set; } = [];
    public InfluencerProfileViewModel? Influencer { get; set; }
    public BusinessProfileViewModel? Business { get; set; }
}

public class InfluencerProfileViewModel
{
    public bool IsOpenForBooking { get; set; }
    public string? BookingEmail { get; set; }
    public string? BookingPhone { get; set; }
    public string? MediaKitUrl { get; set; }
    public string? MediaKitName { get; set; }
    public long? MediaKitSize { get; set; }
    public DateTime? MediaKitUpdatedAt { get; set; }
    public bool ShowEngagementStats { get; set; } = true;
}

public class BusinessProfileViewModel
{
    public string? CompanyName { get; set; }
    public string? TaxCode { get; set; }
    public string? BusinessType { get; set; }
    public string? RepresentativeName { get; set; }
    public string? Website { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? BusinessAddress { get; set; }
    public string? Description { get; set; }
    public bool IsVerified { get; set; }
}

public class ProfileAreaViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ProfileTagViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
