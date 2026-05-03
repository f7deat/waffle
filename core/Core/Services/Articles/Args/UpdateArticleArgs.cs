namespace Waffle.Core.Services.Articles.Args;

public class UpdateArticleArgs
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Thumbnail { get; set; }
    public string Locale { get; set; } = "vi-VN";
    public DateTime? PublishedAt { get; set; }
}
