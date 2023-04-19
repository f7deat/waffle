using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Swiper : AbstractComponent
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("mode")]
        public string Mode { get; set; } = "default";

        [JsonIgnore]
        public List<SwiperItem> Items { get; set; } = new();
    }

    public class SwiperItem
    {
        public string? Title { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
    }
}
