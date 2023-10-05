using System.Text.Json.Serialization;

namespace Waffle.Models.Components;

public class Option
{
    [JsonPropertyName("label")]
    public string? Label { get; set; }
    [JsonPropertyName ("value")]
    public object? Value { get; set; }
}
