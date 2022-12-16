using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Image : AbstractComponent
    {
        public Image()
        {
            Src = string.Empty;
            Title = string.Empty;
            Description = string.Empty;
            Url = string.Empty;
        }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; }
        [JsonPropertyName("src")]
        public string Src { get; set; }
        [JsonPropertyName("width")]
        public int? Width { get; set; }
        [JsonPropertyName("height")]
        public int? Height { get; set; }
        [JsonPropertyName("fileContent")]
        public FileContent? FileContent { get; set; }
    }
}
