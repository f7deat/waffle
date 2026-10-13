using System.ComponentModel.DataAnnotations;

namespace Waffle.Core.Services.Locations.Args;

public class PlaceAddImageUrlArgs
{
    public Guid PlaceId { get; set; }

    [Required, StringLength(2048)]
    public string ImageUrl { get; set; } = string.Empty;
}
