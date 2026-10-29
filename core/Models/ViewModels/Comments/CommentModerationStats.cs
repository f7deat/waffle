namespace Waffle.Models.ViewModels.Comments;

public class CommentModerationStats
{
    public int TotalToday { get; set; }
    public int Pending { get; set; }
    public int Reported { get; set; }
    public int Active { get; set; }
    public int Hidden { get; set; }
    public int Spam { get; set; }
}
