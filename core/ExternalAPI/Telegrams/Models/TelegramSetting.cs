using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Telegrams.Models;

public class TelegramSetting
{
    [JsonPropertyName("token")]
    public string? Token { get; set; }
    [JsonPropertyName("chatId")]
    public string? ChatId { get; set; }
}
