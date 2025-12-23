using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities.Tags;

public class TagCatalog
{
    [ForeignKey(nameof(Catalog))]
    public Guid CatalogId { get; set; }
    [ForeignKey(nameof(Tag))]
    public Guid TagId { get; set; }

    public Catalog? Catalog { get; set; }
    public Tag? Tag { get; set; }
}
