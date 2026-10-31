namespace Waffle.Core.Services.Articles.Args;

public class ArticleEditorialDetailArgs
{
    public string? SpotlightLabel { get; set; }
    public string? HeroCaption { get; set; }
    public string? AuthorName { get; set; }
    public string? AuthorHandle { get; set; }
    public string? AuthorTitle { get; set; }
    public string? AuthorAvatar { get; set; }
    public string? AuthorBio { get; set; }
    public int? ReadingMinutes { get; set; }
    public List<string>? Topics { get; set; }
    public string? RouteTitle { get; set; }
    public string? RouteDescription { get; set; }
    public string? RouteAddress { get; set; }
    public string? RouteMapUrl { get; set; }
    public string? RouteDownloadUrl { get; set; }
    public List<ArticleEditorialStopArgs>? RouteStops { get; set; }
}

public class ArticleEditorialStopArgs
{
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public string? Address { get; set; }
    public string? PriceRange { get; set; }
    public string? OpeningHours { get; set; }
    public string? MapsUrl { get; set; }
    public string? Voucher { get; set; }
}
