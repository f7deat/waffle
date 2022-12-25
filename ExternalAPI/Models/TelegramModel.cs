using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models
{
    public class Telegram
    {
        public Telegram()
        {
            Bot = string.Empty;
        }
        [JsonPropertyName("bot")]
        public string Bot { get; set; }
    }
}
