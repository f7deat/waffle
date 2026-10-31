using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waffle.Entities;

public class ArticleEditorialDetail
{
    [Key]
    [ForeignKey(nameof(Article))]
    public Guid ArticleId { get; set; }

    [StringLength(128)]
    public string? SpotlightLabel { get; set; }

    [StringLength(512)]
    public string? HeroCaption { get; set; }

    [StringLength(128)]
    public string? AuthorName { get; set; }

    [StringLength(128)]
    public string? AuthorHandle { get; set; }

    [StringLength(256)]
    public string? AuthorTitle { get; set; }

    [StringLength(2048)]
    public string? AuthorAvatar { get; set; }

    [StringLength(2048)]
    public string? AuthorBio { get; set; }

    public int? ReadingMinutes { get; set; }

    public string TopicsJson { get; set; } = "[]";

    [StringLength(256)]
    public string? RouteTitle { get; set; }

    [StringLength(1024)]
    public string? RouteDescription { get; set; }

    [StringLength(512)]
    public string? RouteAddress { get; set; }

    [StringLength(2048)]
    public string? RouteMapUrl { get; set; }

    [StringLength(2048)]
    public string? RouteDownloadUrl { get; set; }

    public string RouteStopsJson { get; set; } = "[]";

    public Article Article { get; set; } = default!;
}
