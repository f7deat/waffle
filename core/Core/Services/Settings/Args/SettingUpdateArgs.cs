namespace Waffle.Core.Services.Settings.Args;

public class SettingUpdateArgs
{
    public string Name { get; set; } = default!;
    public object? Value { get; set; }
}
