namespace Waffle.Models.Result;

public class NavItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Url { get; set; }
    public int SortOrder { get; set; }
    public bool Active { get; set; }
    public IEnumerable<NavItem>? Children { get; set; }
}
