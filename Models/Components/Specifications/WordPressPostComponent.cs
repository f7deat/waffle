using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class WordPressPostComponent
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("domain")]
        public string Domain { get; set; } = string.Empty;
    }
}
