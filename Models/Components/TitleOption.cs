using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class TitleOption
    {
        public TitleOption()
        {
            Label = string.Empty;
        }
        [JsonPropertyName("label")]
        public string Label { get; set; }
    }

    public class UpdateTitleOption : TitleOption
    {
        [JsonPropertyName("workId")]
        public Guid WorkId { get; set; }
    }
}
