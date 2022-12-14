using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class WorkItem
    {
        [JsonPropertyName("workContentId")]
        public Guid WorkContentId { get; set; }
        [JsonPropertyName("catalogId")]
        public Guid CatalogId { get; set; }
        [JsonPropertyName("sortOrder")]
        public int SortOrder { get; set; }
    }
}
