using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.ViewModels;

public class DropModel
{
    public Guid DragNodeKey { get; set; }
    public Guid Node { get; set; }
    public bool DropToGap { get; set; }
}

public class TagListItem : Catalog
{
    public int PostCount { get; set; }
}

public class CatalogListItem : BaseEntity
{
    public string? CreatedBy { get; set; } = default!;
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public Guid? ParentId { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    [StringLength(200)]
    public string NormalizedName { get; set; } = default!;
    public CatalogType Type { get; set; }
    public int ViewCount { get; set; }
    public string? Thumbnail { get; set; }
    public bool Active { get; set; }
    public string Locale { get; set; } = default!;
    public string? Url { get; set; }
    public int CommentCount { get; set; }
}