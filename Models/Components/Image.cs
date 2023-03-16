using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Image : AbstractComponent
    {
        public Image()
        {
            Alt = string.Empty;
            Description = string.Empty;
            Src = string.Empty;
            Link = new Link();
        }
        [JsonPropertyName("alt")]
        public string Alt { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("url")]
        public string Src { get; set; }
        [JsonPropertyName("width")]
        public int? Width { get; set; }
        [JsonPropertyName("height")]
        public int? Height { get; set; }
        [JsonPropertyName("containerClassName")]
        public string? ContainerClassName { get; set; }
        [JsonPropertyName("link")]
        public Link Link { get; set; }
        [JsonPropertyName("fileId")]
        public Guid FileId { get; set; }
        [JsonPropertyName("workId")]
        public Guid WorkId { get; set; }

        [JsonIgnore]
        public bool HasLink => !string.IsNullOrEmpty(Link.Name);
    }
}
