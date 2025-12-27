using Waffle.Entities;

namespace Waffle.Core.Services.Locations.Args;

public class PlaceUpdateArgs : BaseEntity
{
    public int? DistrictId { get; set; }
    public string? Address { get; set; }
    public string? Content { get; set; }
}
