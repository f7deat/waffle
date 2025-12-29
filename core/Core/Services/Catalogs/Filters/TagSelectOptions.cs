using Waffle.Models;

namespace Waffle.Core.Services.Catalogs.Filters;

public class TagSelectOptions : SelectOptions
{
    public Guid? CatalogId { get; set; }
}
