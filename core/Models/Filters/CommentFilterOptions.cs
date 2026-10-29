using Waffle.Entities;

namespace Waffle.Models.Filters;

public class CommentFilterOptions : FilterOptions
{
    public Guid CatalogId { get; set; }
    public CommentStatus? Status { get; set; }
    public string? SearchTerm { get; set; }
    public bool? Reported { get; set; }
}
