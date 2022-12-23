using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public abstract class BasicWorkContent : BaseEntity<Guid>
    {
        public BasicWorkContent()
        {
            Name = string.Empty;
        }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("componentId")]
        public Guid ComponentId { get; set; }
        [JsonPropertyName("parentId")]
        public Guid? ParentId { get; set; }
        [JsonPropertyName("active")]
        public bool Active { get; set; }
    }
    public class WorkContent : BasicWorkContent
    {
        public WorkContent()
        {
            Arguments = string.Empty;
        }
        [JsonPropertyName("arguments")]
        public string Arguments { get; set; }
    }
}
