using System.Text.Json.Serialization;
using Waffle.Core.Interfaces;

namespace Waffle.Core.Foundations;

public abstract class AbstractComponent : IComponent
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    [JsonIgnore]
    public string NormalizedName { get; set; } = default!;
}
