using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Image : AbstractComponent
    {
        public Image()
        {
            Alt = string.Empty;
            Description = string.Empty;
            Link = new Link();
            File = new FileContent();
            Wrapper = string.Empty;
        }

        [JsonPropertyName("alt")]
        public string Alt { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("width")]
        public int? Width { get; set; }
        [JsonPropertyName("height")]
        public int? Height { get; set; }
        [JsonPropertyName("link")]
        public Link Link { get; set; }
        [JsonPropertyName("file")]
        public FileContent File { get; set; }
        [JsonPropertyName("wrapper")]
        public string Wrapper { get; set; }

        [JsonIgnore]
        public string Src => File.Url;

        [JsonIgnore]
        public bool HasImage => !string.IsNullOrEmpty(Src);

        [JsonIgnore]
        public bool HasLink => !string.IsNullOrEmpty(Link.Name);
    }
}
