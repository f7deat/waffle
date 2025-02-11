using Waffle.Entities;

namespace Waffle.Models.List;

public class CatalogTypeListItem
{
    public CatalogType CatalogType { get; set; }
    public string? Name { get; set; }
    public int? CatalogCount { get; set; }
}
