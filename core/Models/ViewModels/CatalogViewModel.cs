﻿using Waffle.Entities;

namespace Waffle.Models.ViewModels;

public class DropModel
{
    public Guid DragNodeKey { get; set; }
    public Guid Node { get; set; }
    public bool DropToGap { get; set; }
}

public class TagListItem : Catalog
{
    public int PostCount { get; set; }
}

public class CatalogListItem : Catalog
{
    public string? Category { get; set; }
    public string Url
    {
        get
        {
            var type = Type.ToString().ToLower();
            if (Type == CatalogType.Album)
            {
                type = CatalogType.Leaf.ToString();
            }
            if (string.IsNullOrEmpty(Category))
            {
                return $"/{type}/{NormalizedName}";
            }
            return $"/{type}/{Category}/{NormalizedName}";
        }
    }
}

public class UrlOption
{
    public string Name { get; set; } = default!;
    public string NormalizedName { get; set; } = default!;
    public string Category { get; set; } = default!;
    public CatalogType Type { get; set; }
    public string Url
    {
        get
        {
            if (string.IsNullOrEmpty(Category))
            {
                return $"/{Type.ToString().ToLower()}/{NormalizedName}";
            }
            return $"/{Type.ToString().ToLower()}/{Category}/{NormalizedName}";
        }
    }
}