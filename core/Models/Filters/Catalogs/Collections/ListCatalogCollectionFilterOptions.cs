namespace Waffle.Models.Filters.Catalogs.Collections;

public class ListCatalogCollectionFilterOptions : FilterOptions
{
    public Guid CatalogId { get; set; }
}

public class ListCatalogByCollectionFilterOptions : FilterOptions
{
    public Guid CollectionId { get; set; }
}