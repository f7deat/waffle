using Microsoft.Data.SqlClient;
using System.Text.Json.Serialization;
using Waffle.Core.Constants;
using Waffle.Entities;

namespace Waffle.Models;

public interface IFilterOptions
{
    public int Current { get; set; }
    public int PageSize { get; set; }
}

public class FilterOptions : IFilterOptions
{
    [JsonPropertyName("current")]
    public int Current { get; set; } = 1;
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
    public string Locale { get; set; } = "vi-VN";
}

public class FileFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? FolderId { get; set; }
}

public class CatalogFilterOptions : FilterOptions
{
    #region Search
    public string? Name { get; set; }
    public bool? Active { get; set; }
    public CatalogType? Type { get; set; }
    public Guid? ParentId { get; set; }
    public string? CreatedBy { get; set; }
    #endregion

    #region Sort order
    public SortOrder? ViewCount { get; set; }
    public SortOrder? CreatedDate { get; set; }
    #endregion
}

public class ProductFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public bool? Active { get; set; }
    public Guid? ParentId { get; set; }
}

public class SearchFilterOptions : FilterOptions
{
    public string? SearchTerm { get; set; }
}

public class WorkFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public Guid? ParentId { get; set; }
    public bool? Active { get; set; }
}

public class BasicFilterOptions : FilterOptions
{

}

public class ComponentFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public bool? Active { get; set; }
}

public class ArticleFilterOptions : FilterOptions
{
    public string? Name { get; set; }
}

public class ArticleRelatedFilterOption : FilterOptions
{
    public IEnumerable<Guid> TagIds { get; set; } = null!;
    public Guid CatalogId { get; set; }
    public CatalogType Type { get; set; }
    public Guid? ParentId { get; set; }
}

public class TagFilterOptions : FilterOptions
{
    public string? KeyWords { get; set; }
    public OrderBy? OrderBy { get; set; }
}

public class LocalizationFilterOptions: FilterOptions
{
    public string? Key { get; set; }
    public bool? IsTranslated { get; set; }
}

public class SelectFilterOptions
{
    public string? KeyWords { get; set; }
    public CatalogType Type { get; set; }
    public string Locale { get; set; } = "vi-VN";
}

public class OptionFilterOptions
{
    public string? Locale { get; set; }
    public string? KeyWords { get; set; }
}

public class CatalogSelectOptions
{
    public string Locale { get; set; } = "vi-VN";
    public CatalogType? Type { get; set; }
}