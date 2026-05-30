namespace Waffle.Core.Services.Locations.Args;

public class PlaceCreateArgs
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Active { get; set; } = true;
    public string Locale { get; set; } = "vi-VN";
    public int? DistrictId { get; set; }
    public string? Address { get; set; }
    public Guid? InfluencerId { get; set; }
    public string? Content { get; set; }
}
