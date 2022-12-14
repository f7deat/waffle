using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models
{
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
        public string? Name { get; set; }
        public bool? Active { get; set; }
        public CatalogType Type { get; set; }
    }

    public class SearchFilterOptions : FilterOptions
    {
        public string? SearchTerm { get; set; }
    }

    public class WorkFilterOptions : FilterOptions
    {

    }

    public class BasicFilterOptions : FilterOptions
    {

    }
}
