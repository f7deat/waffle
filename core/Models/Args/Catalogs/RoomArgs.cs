namespace Waffle.Models.Args.Catalogs;

public class RoomArgs
{
    public Guid CatalogId { get; set; }
    public string? AffiliateLink { get; set; }
    public List<string>? Galleries { get; set; }
}
