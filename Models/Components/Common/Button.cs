using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Button : AbstractComponent
    {
        public Button()
        {
            Icon = string.Empty;
            Text = string.Empty;
            Type = "button";
        }

        [JsonPropertyName("icon")]
        public string Icon { get; set; }
        [JsonPropertyName("text")]
        public string Text { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonIgnore]
        public bool HasIcon => !string.IsNullOrEmpty(Icon);
    }
}
