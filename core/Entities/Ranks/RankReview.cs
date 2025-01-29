namespace Waffle.Entities.Ranks;

public class RankReview : BaseEntity
{
    public Guid RankId { get; set; }
    public Guid UserId { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool Liked { get; set; }

    public RankItem? RankItem { get; set; }
}
