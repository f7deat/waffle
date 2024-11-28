using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models;

public class WordPressPost
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("slug")]
    public string? Slug { get; set; }
    [JsonPropertyName("title")]
    public WordPressTitle Title { get; set; } = new();
    [JsonPropertyName("content")]
    public WordPressContent Content { get; set; } = new();
    [JsonPropertyName("date")]
    public DateTime? Date { get; set; }
    [JsonPropertyName("excerpt")]
    public WordPressExcerpt Excerpt { get; set; } = new();
    [JsonPropertyName("featured_media")]
    public int? FeaturedMedia { get; set; }
}

public class WordPressTitle
{
    [JsonPropertyName("rendered")]
    public string? Rendered { get; set; }
}

public class WordPressContent
{
    [JsonPropertyName("rendered")]
    public string? Rendered { get; set; }
}

public class WordPressExcerpt
{
    [JsonPropertyName("rendered")]
    public string? Rendered { get; set; }
}
