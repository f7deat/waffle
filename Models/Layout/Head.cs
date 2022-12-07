using System.Text.Json.Serialization;

namespace Waffle.Models.Layout
{
    public class Head
    {
        public Head()
        {
            TitleSuffix = string.Empty;
        }
        [JsonPropertyName("titleSuffix")]
        public string TitleSuffix { get; set; }
    }
}
