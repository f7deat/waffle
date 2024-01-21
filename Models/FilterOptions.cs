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

public abstract class FilterOptions : IFilterOptions
{
    [JsonPropertyName("current")]
    public int Current { get; set; } = 1;
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;
}

public class FileFilterOptions : FilterOptions
{
    public string? Name { get; set; }
    public string? Type { get; set; }
}

public class CatalogFilterOptions : FilterOptions
{
    #region Search
    public string? Name { get; set; }
    public bool? Active { get; set; }
    public CatalogType? Type { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? CreatedBy { get; set; }
    public string? Locale { get; set; }
    #endregion

    #region Sort order
    public SortOrder? ViewCount { get; set; }
    public SortOrder? ModifiedDate { get; set; }
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
}

public class TagFilterOptions : FilterOptions
{
    public string? KeyWords { get; set; }
    public OrderBy? OrderBy { get; set; }
}

public class LocalizationFilterOptions: FilterOptions
{
    public string? Key { get; set; }
    public string Locale { get; set; } = "vi-VN";
}

public class SelectFilterOptions
{
    public string? KeyWords { get; set; }
    public CatalogType Type { get; set; }
    public string Locale { get; set; } = "vi-VN";
}
