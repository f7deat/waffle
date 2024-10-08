﻿using System.ComponentModel.DataAnnotations;

namespace Waffle.Models.Components;

[Display(Name = "Breadcrumb", Prompt = nameof(Breadcrumb), AutoGenerateField = true)]
public class Breadcrumb
{
    public string? Url { get; set; }
    public string? Name { get; set; }
    public int Position { get; set; }
    public string Icon { get; set; } = "fas fa-folder";
}
