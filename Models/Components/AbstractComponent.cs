using System.Text.Json.Serialization;
using Waffle.Core.Interfaces;

namespace Waffle.Models.Components;

public abstract class AbstractComponent : IComponent
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    [JsonPropertyName("className")]
    public string? ClassName { get; set; }
    [JsonIgnore]
    public string NormalizedName { get; set; } = default!;
}
