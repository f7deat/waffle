using Waffle.Entities;

namespace Waffle.Models.ViewModels.Comments;

public class CommentListItem : Comment
{
    public string? UserName { get; set; } = default!;
    public string? CatalogName { get; set; }
}
