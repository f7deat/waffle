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
        public int Current { get; set; } = 1;
        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; } = 10;
    }

    public class FileFilterOptions : FilterOptions
    {

    }
}
