using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public abstract class AbstractComponent
    {
        public AbstractComponent()
        {
            ClassName = string.Empty;
        }

        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("className")]
        public string ClassName { get; set; }
    }
}
