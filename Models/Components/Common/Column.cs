using System.Text.Json.Serialization;

namespace Waffle.Models.Components;

public class Column : AbstractComponent
{
    public Column()
    {
        WorkListItems = new List<WorkListItem>();
    }
    [JsonPropertyName("rowId")]
    public Guid RowId { get; set; }

    [JsonIgnore]
    public IEnumerable<WorkListItem> WorkListItems { get; set; }
}
