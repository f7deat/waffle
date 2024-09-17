namespace Waffle.Models;

public class WorkComponent<T> where T : class
{
    public string? Name { get; set; }
    public string ComponentName { get; set; } = default!;
    public string NormalizedName { get; set; } = default!;
    public T? Data { get; set; }
}
