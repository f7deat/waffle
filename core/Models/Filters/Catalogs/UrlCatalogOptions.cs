using Waffle.Entities;

namespace Waffle.Models.Filters.Catalogs;

public class UrlCatalogOptions : OptionFilterOptions
{
    public CatalogType? Type { get; set; }
}
