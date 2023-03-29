using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Jumbotron
    {
        [JsonPropertyName("backgroundImage")]
        public string BackgroundImage { get; set; } = string.Empty;

        [JsonPropertyName("links")]
        public List<Link> Links { get; set; } = new();

        [JsonIgnore]
        public bool HasBackgroundImage => !string.IsNullOrEmpty(BackgroundImage);
    }
}
