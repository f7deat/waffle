using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Link : BaseEntity
    {
        [JsonPropertyName("href")]
        public string Href { get; set; } = "#";
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("target")]
        public string? Target { get; set; }
    }
}
