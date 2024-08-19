using Waffle.Entities;

namespace Waffle.Extensions;

public static class CatalogExtensions
{
    public static string GetUrl(this Catalog catalog)
    {
        if (catalog.Type != CatalogType.Leaf)
        {
            return $"/{catalog.Type.ToString().ToLower()}/{catalog.NormalizedName}";
        }
        return $"/leaf/{catalog.NormalizedName}";
    }
}
