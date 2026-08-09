using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Telegrams.Models;

public class TelegramSetting
{
    [JsonPropertyName("botToken")]
    public string? BotToken { get; set; }
    [JsonPropertyName("chatId")]
    public string? ChatId { get; set; }
}
