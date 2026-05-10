using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities.Settings;

public class Category : BaseEntity<int>, ISoftDelete
{
    [StringLength(256)]
    public string Name { get; set; } = null!;
    [StringLength(512)]
    public string? Description { get; set; }
    public int? ParentId { get; set; }
    public CategoryType Type { get; set; }
    public DateTime? DeletedAt { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = "vi-VN";

    public ICollection<Article>? Articles { get; set; }
}

public enum CategoryType
{
    Article = 1,
    Product = 2
}