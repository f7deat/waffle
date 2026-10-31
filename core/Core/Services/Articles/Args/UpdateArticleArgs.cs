namespace Waffle.Core.Services.Articles.Args;

public class UpdateArticleArgs
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Thumbnail { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public int? CategoryId { get; set; }
    public bool IsFeatured { get; set; }
    public List<Guid>? TagIds { get; set; }
    public ArticleEditorialDetailArgs? Editorial { get; set; }
}
