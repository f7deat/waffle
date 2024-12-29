using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Affliates;

public class AffiliateLink : BaseEntity
{
    [ForeignKey(nameof(Catalog))]
    public Guid CatalogId { get; set; }
    [StringLength(256)]
    public string Url { get; set; } = default!;
    [StringLength(256)]
    public string Name { get; set; } = default!;
    public int ClickCount { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }

    public Catalog? Catalog { get; set; }
}
