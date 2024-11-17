using System.Text.Json.Serialization;

namespace Waffle.Models.Settings;

public class EmailSetting
{
    [JsonPropertyName("port")]
    public int Port { get; set; }
    [JsonPropertyName("host")]
    public string? Host { get; set; }
    [JsonPropertyName("userName")]
    public string? UserName { get; set; }
    [JsonPropertyName("password")]
    public string? Password { get; set; }
}
