using Waffle.Models.ViewModels;

namespace Waffle.Models.Components;

public class CollectionComponent
{
    public string? Title { get; set; }
    public IEnumerable<CatalogListItem> Catalogs { get; set; } = [];
}
