﻿using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components;

public class Navbar : BaseEntity
{
    [JsonPropertyName("container")]
    public bool Container { get; set; }
    [JsonPropertyName("layout")]
    public Layout Layout { get; set; }
    [JsonIgnore]
    public List<NavItem> NavItems { get; set; } = new List<NavItem>();
}

public class NavItem : Link
{
    [JsonPropertyName("children")]
    public IEnumerable<NavItem>? Children { get; set; }
    public string? Icon { get; set; }
}

public enum Layout
{
    Default,
    Vertical
}
