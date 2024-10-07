using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components.Editors;

[Display(Name = nameof(CkEditor), Prompt = nameof(CkEditor))]
public class CkEditor : AbstractComponent
{
    [JsonPropertyName("content")]
    public string? Content { get; set; }
}
