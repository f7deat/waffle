using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components.Specifications
{
    public class ArticleSpotlight
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;
        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; } = 5;

        [JsonIgnore]
        public Guid TagId { get; set; }
        [JsonIgnore]
        public List<Catalog> Articles { get; set; } = new();
    }
}
