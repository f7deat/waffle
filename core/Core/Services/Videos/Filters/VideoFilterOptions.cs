using Waffle.Entities.Files;
using Waffle.Models;

namespace Waffle.Core.Services.Videos.Filters;

public class VideoFilterOptions : FilterOptions
{
    public string? Keyword { get; set; }
    public VideoSourceType? SourceType { get; set; }
}
