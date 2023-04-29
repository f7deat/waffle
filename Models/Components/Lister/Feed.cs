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

        [JsonIgnore]
        public List<Catalog> Articles { get; set; } = new();
        [JsonIgnore]
        public int ViewSizeMobile { get; set; } = 1;
        [JsonIgnore]
        public int ViewSizeDesktop { get; set; } = 4;
    }
}
