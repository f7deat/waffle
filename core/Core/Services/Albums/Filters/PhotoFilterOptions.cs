using Waffle.Models;

namespace Waffle.Core.Services.Albums.Filters;

public class PhotoFilterOptions : FilterOptions
{
    public Guid? AlbumId { get; set; }
}
