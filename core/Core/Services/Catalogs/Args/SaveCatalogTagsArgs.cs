namespace Waffle.Core.Services.Catalogs.Args;

public class SaveCatalogTagsArgs
{
    public Guid CatalogId { get; set; }
    public List<Guid>? TagIds { get; set; }
}
