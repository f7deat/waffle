using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities;

public class CommentModerationRule : BaseEntity
{
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    [StringLength(500)]
    public string? Description { get; set; }
    [StringLength(500)]
    public string Pattern { get; set; } = string.Empty;
    public CommentRuleAction Action { get; set; }
    public bool IsEnabled { get; set; } = true;
    public int MatchCount { get; set; }
}

public enum CommentRuleAction
{
    NeedsReview = 0,
    Spam = 1
}
