namespace Waffle.Core.Services.Articles.Args;

public class CreateArticleArgs
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
}
