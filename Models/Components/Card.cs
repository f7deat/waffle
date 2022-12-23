using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Card : BaseEntity<Guid>
    {
        public Card()
        {
            Title = string.Empty;
            Text = string.Empty;
        }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("text")]
        public string Text { get; set; }
        [JsonPropertyName("image")]
        public FileContent? Image { get; set; }
    }
}
