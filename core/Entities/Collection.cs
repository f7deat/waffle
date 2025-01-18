namespace Waffle.Entities;

public class Collection
{
    public Guid CollectionId { get; set; }
    public Guid CatalogId { get; set; }
    public int SortOrder { get; set; }
}
