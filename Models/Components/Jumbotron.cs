using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Jumbotron
    {
        public Jumbotron()
        {
            Image = new Image();
            Links = new List<Link>();
        }

        [JsonPropertyName("image")]
        public Image Image { get; set; }

        [JsonPropertyName("links")]
        public List<Link> Links { get; set; }
    }
}
