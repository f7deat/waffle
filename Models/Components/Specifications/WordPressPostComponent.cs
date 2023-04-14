using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class WordPressPostComponent
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("domain")]
        public string Domain { get; set; } = string.Empty;
    }
}
