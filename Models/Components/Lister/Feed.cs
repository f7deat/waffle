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
        [JsonPropertyName("type")]
        public CatalogType? Type { get; set; }
        [JsonPropertyName("itemPerRow")]
        public string ItemPerRow { get; set; } = "grid-cols-2 md:grid-cols-4";

        [JsonIgnore]
        public List<Catalog> Articles { get; set; } = new();
    }
}
