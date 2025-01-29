namespace Waffle.Entities.Ranks;

public class RankReview : BaseEntity
{
    public Guid RankItemId { get; set; }
    public Guid UserId { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public bool Liked { get; set; }

    public RankItem? RankItem { get; set; }
}
