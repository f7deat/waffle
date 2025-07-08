using System.Text.Json.Serialization;

namespace Waffle.Models.Settings;

public class UploadSetting
{
    [JsonPropertyName("type")]
    public UploadSettingType Type { get; set; }
}

public enum UploadSettingType
{
    LOCAL,
    HPUNI
}
