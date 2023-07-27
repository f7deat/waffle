﻿using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components.Lister
{
    public class VideoPlayList : AbstractComponent
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }
        [JsonPropertyName("className")]
        public string? ClassName { get; set; }

        [JsonIgnore]
        public List<PlaylistItem> PlaylistItems { get; set; } = new();
        [JsonIgnore]
        public bool HasData { get; set; }
    }

    public class PlaylistItem
    {
        public string? Name { get; set; }
        public string? Thumbnail { get; set; }
        public string? Url { get; set; }
        public string? Date { get; set; }
        public string? ViewCount { get; set; }
    }
}
