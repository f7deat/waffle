using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Title
    {
        public Title()
        {
            Label = string.Empty;
        }
        [JsonPropertyName("label")]
        public string Label { get; set; }
    }

    public class UpdateTitleOption : Title
    {
        [JsonPropertyName("workId")]
        public Guid WorkId { get; set; }
    }
}
