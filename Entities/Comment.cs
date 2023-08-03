namespace Waffle.Entities;

public class Comment : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid CatalogId { get; set; }
    public string Content { get; set; } = default!;
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid? ParrentId { get; set; }
    public int Status { get; set; }
}
