using System.ComponentModel.DataAnnotations;
using Waffle.Core.Foundations.Interfaces;

namespace Waffle.Entities;

public class Article : AuditEntity, ISoftDelete, ILocale
{
    [StringLength(512)]
    public string Name { get; set; } = default!;
    [StringLength(1024)]
    public string? Description { get; set; }
    [StringLength(512)]
    public string NormalizedName { get; set; } = default!;
    public int ViewCount { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? Content { get; set; }
    [StringLength(2048)]
    public string? Thumbnail { get; set; }
    [StringLength(10)]
    public string Locale { get; set; } = "vi-VN";
    public DateTime? PublishedAt { get; set; }
}
