namespace Waffle.Core.Options;

public class SettingOptions
{
    public const string Settings = "Settings";
    public string DefaultLanguage { get; set; } = "vi-VN";
    public string Theme { get; set; } = default!;
    public string UploadAPIKey { get; set; } = default!;
    public string SupperPass { get; set; } = default!;
}
