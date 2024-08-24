namespace Waffle.Core.Foundations.Models;

public class SettingModel<T> where T : class
{
    public string? Name { get; set; }
    public string NormalizedName { get; set; } = default!;
    public T? Data { get; set; }
}
