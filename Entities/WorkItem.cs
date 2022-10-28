using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class WorkItem : BaseEntity
    {
        public WorkItem()
        {
            Arguments = string.Empty;
        }
        [JsonPropertyName("arguments")]
        public string Arguments { get; set; }
        [JsonPropertyName("componentId")]
        public Guid ComponentId { get; set; }
        [JsonPropertyName("catalogId")]
        public Guid CatalogId { get; set; }
        [JsonPropertyName("parentId")]
        public Guid? ParentId { get; set; }
    }
}
