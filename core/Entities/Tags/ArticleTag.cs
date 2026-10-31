namespace Waffle.Entities.Tags;

public class ArticleTag
{
    public Guid ArticleId { get; set; }
    public Guid TagId { get; set; }

    public Article Article { get; set; } = default!;
    public Tag Tag { get; set; } = default!;
}
