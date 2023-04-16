using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Feed : BaseEntity
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonIgnore]
        public IEnumerable<Catalog>? Articles { get; set; }
    }
}
