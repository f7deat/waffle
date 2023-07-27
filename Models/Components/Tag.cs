using System.ComponentModel.DataAnnotations;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Tag", ShortName = "TAG")]
public class Tag : AbstractComponent
{
    public string? Name { get; set; }
}
