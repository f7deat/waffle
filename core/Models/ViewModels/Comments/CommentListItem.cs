using Waffle.Entities;

namespace Waffle.Models.ViewModels.Comments;

public class CommentListItem : Comment
{
    public string? UserName { get; set; } = default!;
    public string? UserEmail { get; set; }
    public string? CatalogName { get; set; }
    public string? CatalogUrl { get; set; }
    public string? UserAvatar { get; set; }
    public int ReportCount { get; set; }
    public int UserCommentCount { get; set; }
    public int UserViolationCount { get; set; }
    public int ReplyCount { get; set; }
}
