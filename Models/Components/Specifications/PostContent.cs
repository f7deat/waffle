using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Waffle.Models.Components.Specifications
{
    [DisplayName("Post Content")]
    public class PostContent
    {
        [JsonPropertyName("type")]
        public PostContentType Type { get; set; }
        [JsonPropertyName("wordPress")]
        public WordPressContent WordPress { get; set; } = new();
        [JsonPropertyName("blockEditor")]
        public BlockEditor BlockEditor { get; set; } = new();
    }

    public enum PostContentType
    {
        BlockEditor,
        WordPress,
        Blogspot
    }

    public class WordPressContent
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("domain")]
        public string Domain { get; set; } = string.Empty;
    }
}
