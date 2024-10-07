using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Html", Prompt = nameof(Html))]
public class Html : AbstractComponent
{
    [JsonPropertyName("value")]
    public string Value { get; set; } = "<div></div>";
}
