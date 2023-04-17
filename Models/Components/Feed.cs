using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Feed : BaseEntity
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }

        [JsonIgnore]
        public List<Catalog> Articles { get; set; } = new();
    }
}
