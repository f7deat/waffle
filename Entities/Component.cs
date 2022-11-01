using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class Component : BaseEntity
    {
        public Component()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("normalizedName")]
        public string NormalizedName { get; set; }
        [JsonPropertyName("active")]
        public bool Active { get; set; }
    }
}
