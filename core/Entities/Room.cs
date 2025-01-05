using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities;

public class Room : BaseEntity
{
    [ForeignKey(nameof(Catalog))]
    public Guid CatalogId { get; set; }
    [StringLength(2048)]
    public string? AffiliateLink { get; set; }
    public string? Galleries { get; set; }

    public Catalog? Catalog { get; set; }
}
