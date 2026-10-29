using System.Text.Json.Serialization;

namespace Waffle.Entities;

public class Comment : BaseEntity
{
    [JsonPropertyName("userId")]
    public Guid UserId { get; set; }
    [JsonPropertyName("catalogId")]
    public Guid CatalogId { get; set; }
    [JsonPropertyName("content")]
    public string Content { get; set; } = default!;
    [JsonPropertyName("createdDate")]
    public DateTime CreatedDate { get; set; }
    [JsonPropertyName("modifiedDate")]
    public DateTime? ModifiedDate { get; set; }
    [JsonPropertyName("ParentId")]
    public Guid? ParentId { get; set; }
    [JsonPropertyName("status")]
    public CommentStatus Status { get; set; }
    [JsonPropertyName("rating")]
    public int Rating { get; set; }
    [JsonPropertyName("isPinned")]
    public bool IsPinned { get; set; }
    [JsonPropertyName("isOfficialResponse")]
    public bool IsOfficialResponse { get; set; }
}

public enum CommentStatus
{
    Draft = 0,
    Active = 1,
    Deleted = 2,
    Hidden = 3,
    Spam = 4
}
