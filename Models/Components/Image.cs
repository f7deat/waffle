using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Image : AbstractComponent
    {
        public Image()
        {
            Src = string.Empty;
            Alt = string.Empty;
            Url = string.Empty;
        }
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("src")]
        public string Src { get; set; }
        [JsonPropertyName("alt")]
        public string Alt { get; set; }
        [JsonPropertyName("width")]
        public int? Width { get; set; }
        [JsonPropertyName("height")]
        public int? Height { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
