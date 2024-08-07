using Waffle.Core.Helpers;
using Waffle.Entities;

namespace Waffle.Extensions;

public static class CatalogExtensions
{
    public static string GetUrl(this Catalog catalog)
    {
        if (catalog.ParentId is null)
        {
            return $"/{SeoHelper.CatalogUrl(catalog.Type)}/{catalog.NormalizedName}";
        }
        if (catalog.Type != CatalogType.Leaf)
        {
            return $"/{catalog.Type.ToString().ToLower()}/{catalog.NormalizedName}";
        }
        return $"/leaf/{catalog.NormalizedName}";
    }
}
