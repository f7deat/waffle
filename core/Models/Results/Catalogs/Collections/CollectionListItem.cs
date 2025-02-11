using Waffle.Models.ViewModels;

namespace Waffle.Models.Results.Catalogs.Collections;

public class CollectionListItem : CatalogListItem
{
    public int SortOrder { get; set; }
    public Guid CatalogId { get; set; }
    public Guid CollectionId { get; set; }
}