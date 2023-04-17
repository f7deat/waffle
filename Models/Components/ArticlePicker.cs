﻿using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class ArticlePicker
    {
        [JsonPropertyName("tagId")]
        public Guid TagId { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Catalog> Articles { get; set; } = new();
    }
}
