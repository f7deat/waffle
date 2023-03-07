using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Button : AbstractComponent
    {
        public Button()
        {
            Icon = string.Empty;
            Text = string.Empty;
        }

        [JsonPropertyName("icon")]
        public string Icon { get; set; }
        [JsonPropertyName("text")]
        public string Text { get; set; }

    }
}
