using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class AppSetting : BaseEntity
    {
        public AppSetting()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
            Value = string.Empty;
            Description = string.Empty;
        }
        [StringLength(100)]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [StringLength(100)]
        [JsonPropertyName("normalizedName")]
        public string NormalizedName { get; set; }
        [StringLength(500)]
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("value")]
        public string Value { get; set; }
    }
}
