using Waffle.Core.Helpers;
using Waffle.Entities;

namespace Waffle.Extensions;

public static class CatalogExtensions
{
    public static string GetUrl(this Catalog catalog) => $"/{SeoHelper.CatalogUrl(catalog.Type)}/{catalog.NormalizedName}";
}
