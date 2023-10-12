﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;
using Waffle.Models.ViewModels.Products;

namespace Waffle.Models.Components;

[Display(Name = "Feed", ShortName = "Feed")]
public class Feed : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }
    [JsonPropertyName("type")]
    public CatalogType? Type { get; set; }

    [JsonIgnore]
    public List<Catalog> Articles { get; set; } = new();
    [JsonIgnore]
    public IEnumerable<ProductListItem> Products { get; set; } = new List<ProductListItem>();
}
