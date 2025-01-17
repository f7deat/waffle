namespace Waffle.Models.Results.Components;

public class ComponentListResult
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? NormalizedName { get; set; }
    public bool Active { get; set; }
    public int Count { get; set; }
}
