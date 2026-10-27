using System.ComponentModel.DataAnnotations;

namespace Waffle.Core.Services.Articles.Filters;

public sealed class ArticleScheduleFilterOptions
{
    [Required]
    public DateTimeOffset From { get; set; }

    [Required]
    public DateTimeOffset To { get; set; }

    [Required, StringLength(10)]
    public string Locale { get; set; } = "vi-VN";
    public int? CategoryId { get; set; }
    public Guid? CreatorId { get; set; }
    public string? Status { get; set; }
}
