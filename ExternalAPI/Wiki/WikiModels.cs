using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Wiki
{
    public class Parse
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }
    public class Action
    {
        [JsonPropertyName("parse")]
        public Parse? Parse { get; set; }
    }
}
