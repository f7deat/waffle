using System.Text.Json.Serialization;

namespace Waffle.Models.Settings;

public class EmailSetting
{
    [JsonPropertyName("port")]
    public int Port { get; set; }
    [JsonPropertyName("host")]
    public string? Host { get; set; }
    [JsonPropertyName("fromEmail")]
    public string? FromEmail { get; set; }
    [JsonPropertyName("displayName")]
    public string? DisplayName { get; set; }
    [JsonPropertyName("password")]
    public string? Password { get; set; }
    [JsonPropertyName("protocol")]
    public EmailProtocol Protocol { get; set; }
}

public enum EmailProtocol
{
    Default,
    SendGrid
}
