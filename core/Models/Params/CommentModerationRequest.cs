using Waffle.Entities;

namespace Waffle.Models.Params;

public class CommentModerationRequest
{
    public Guid[] Ids { get; set; } = [];
    public CommentStatus Status { get; set; }
}

public class CommentReplyRequest
{
    public Guid CommentId { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class CommentReportRequest
{
    public string? Reason { get; set; }
}

public class CommentModerationRuleRequest
{
    public Guid? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Pattern { get; set; } = string.Empty;
    public CommentRuleAction Action { get; set; }
    public bool IsEnabled { get; set; }
}
