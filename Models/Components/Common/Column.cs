using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Column", ShortName = nameof(Column), GroupName = GroupName.Grid)]
public class Column : AbstractComponent
{
    public Column()
    {
        WorkListItems = new List<WorkListItem>();
    }

    [JsonPropertyName("className")]
    public string? ClassName { get; set; }

    [JsonPropertyName("rowId")]
    public Guid RowId { get; set; }

    [JsonIgnore]
    public IEnumerable<WorkListItem> WorkListItems { get; set; }
}
