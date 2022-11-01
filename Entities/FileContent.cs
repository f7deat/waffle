using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class FileContent : BaseEntity
    {
        public FileContent()
        {
            Name = string.Empty;
            Type = string.Empty;
            Url = string.Empty;
        }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("size")]
        public decimal Size { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
