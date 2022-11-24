using System.Text.Json.Serialization;

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
        public int Current { get; set; }
        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }
    }
}
