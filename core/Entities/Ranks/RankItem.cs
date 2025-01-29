using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Ranks;

public class RankItem : BaseEntity
{
    [StringLength(256)]
    public string Name { get; set; } = default!;
    public Guid CatalogId { get; set; }
    public string? Thumbnail { get; set; }

    public ICollection<RankReview>? RankReviews { get; set; }
}
