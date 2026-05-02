using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

public class Column : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("rowId")]
    public Guid RowId { get; set; }

    [JsonPropertyName("items")]
    public IEnumerable<WorkListItem> Items { get; set; } = new List<WorkListItem>();
}
