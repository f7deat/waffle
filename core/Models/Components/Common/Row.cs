using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

public class Row : AbstractComponent
{
    public Row()
    {
        Columns = new List<Guid>();
    }
    [JsonIgnore]
    public IEnumerable<Guid> Columns { get; set; }
    [JsonPropertyName("layout")]
    public string? Layout { get; set; }
}
