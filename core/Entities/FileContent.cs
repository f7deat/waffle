﻿using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Waffle.Entities;

public class FileContent : BaseEntity
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    [JsonPropertyName("size")]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Size { get; set; }
    [JsonPropertyName("type")]
    public string Type { get; set; } = default!;
    [JsonPropertyName("url")]
    public string Url { get; set; } = default!;
    public DateTime UploadDate { get; set; }
    public Guid UploadBy { get; set; }
}
