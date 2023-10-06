using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Entities;

namespace Waffle.Models.Components;

[Display(Name = "Header", Prompt = "header", AutoGenerateFilter = true)]
public class Header : AbstractComponent
{
    [JsonPropertyName("brand")]
    public string? Brand { get; set; }
    [JsonPropertyName("logo")]
    public string? Logo { get; set; }
    [JsonPropertyName("viewName")]
    public string ViewName { get; set; } = "Default";

    [JsonIgnore]
    public bool IsAuthenticated { get; set; }

    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public Catalog Catalog { get; set; } = new();
}
