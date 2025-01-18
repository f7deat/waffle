namespace Waffle.Models.Results.Catalogs.Collections;

public class CollectionListItem
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string NormalizedName { get; set; } = default!;
}
