namespace Waffle.Core.Services.Locations.Args;

public class PlaceAddImageArgs
{
    public Guid PlaceId { get; set; }
    public List<IFormFile>? Images { get; set; }
}
