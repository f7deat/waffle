namespace Waffle.Core.Services.Videos.Args;

public class CreateExternalVideoArgs
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string Url { get; set; } = default!;
    public string? ThumbnailUrl { get; set; }
    public int? DurationSeconds { get; set; }
}
