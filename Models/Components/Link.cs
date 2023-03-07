using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Link
    {
        public Link()
        {
            Href = "#";
        }
        [JsonPropertyName("href")]
        public string Href { get; set; }
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("target")]
        public string? Target { get; set; }
    }
}
