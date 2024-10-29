﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Waffle.Entities;

public class Catalog : BaseEntity
{
    [JsonPropertyName("parentId")]
    public Guid? ParentId { get; set; }
    [StringLength(200)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    [StringLength(500)]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [StringLength(200), Required]
    [JsonPropertyName("normalizedName")]
    public string NormalizedName { get; set; } = default!;
    [JsonPropertyName("createdDate")]
    public DateTime CreatedDate { get; set; }
    [JsonPropertyName("modifiedDate")]
    public DateTime ModifiedDate { get; set; }
    [JsonPropertyName("type")]
    public CatalogType Type { get; set; }
    [JsonPropertyName("viewCount")]
    public int ViewCount { get; set; }
    [JsonPropertyName("thumbnail")]
    [StringLength(250)]
    public string? Thumbnail { get; set; }
    [JsonPropertyName("active")]
    public bool Active { get; set; }
    [JsonPropertyName("createdBy")]
    public Guid? CreatedBy { get; set; }
    [JsonPropertyName("locale")]
    [StringLength(10)]
    public string? Locale { get; set; }
    public string? Setting { get; set; }
    public string? Url { get; set; }
}

public enum CatalogType
{
    [Description("Trang")]
    Leaf = 0,
    [Description("Tin tức")]
    Article = 1,
    [Description("Sản phẩm")]
    Product = 2,
    [Description("Entry")]
    Entry = 4,
    [Description("Địa điểm")]
    Location = 5,
    [Description("Album ảnh")]
    Album = 8,
    [Description("Tag")]
    Tag = 9,
    [Description("Video")]
    Video = 10,
    [Description("Game")]
    Game = 11,
    [Description("WordPress")]
    WordPress = 12,
    [Description("Thương hiệu")]
    Brand = 13
}

public class CatalogSetting
{
    public string Layout { get; set; } = "container";
}