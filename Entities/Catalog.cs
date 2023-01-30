using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class Catalog : BaseEntity
    {
        public Catalog()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }

        [JsonPropertyName("parrentId")]
        public Guid? ParentId { get; set; }
        [StringLength(200)]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [StringLength(500)]
        [JsonPropertyName("description")]
        public string? Description { get; set; }
        [StringLength(200)]
        [JsonPropertyName("normalizedName")]
        public string NormalizedName { get; set; }
        [JsonPropertyName("setting")]
        public string? Setting { get; set; }
        [JsonPropertyName("createdDate")]
        public DateTime CreatedDate { get; set; }
        [JsonPropertyName("modifiedDate")]
        public DateTime ModifiedDate { get; set; }
        [JsonPropertyName("publishedDate")]
        public DateTime? PublishedDate { get; set; }
        [JsonPropertyName("type")]
        public CatalogType Type { get; set; }
        [JsonPropertyName("viewCount")]
        public int ViewCount { get; set; }
        [JsonPropertyName("thumbnail")]
        [StringLength(250)]
        public string? Thumbnail { get; set; }
        [JsonPropertyName("active")]
        public bool Active { get; set; }
    }

    public enum CatalogType
    {
        Default,
        Article,
        Shop,
        Setting,
        Entry,
        ArticleCategoy,
        ProductCategory,
        Blogspot
    }
}
