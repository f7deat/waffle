using Microsoft.AspNetCore.Http;

namespace Waffle.Core.Services.Videos.Args;

public class UploadVideoArgs
{
    public IFormFile? File { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int? DurationSeconds { get; set; }
}

public class UpdateVideoArgs
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Url { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int? DurationSeconds { get; set; }
}
