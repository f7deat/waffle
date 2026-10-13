namespace Waffle.Core.Services.Locations.Args;

public class PlaceAddImageArgs
{
    public Guid PlaceId { get; set; }
    public List<IFormFile>? Images { get; set; }
    public List<string>? ImageUrls { get; set; }
}
