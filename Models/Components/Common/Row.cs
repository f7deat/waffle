using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

[Display(Name = "Row", ShortName = "ROW", GroupName = GroupName.Grid)]
public class Row : AbstractComponent
{
    public Row()
    {
        Columns = new List<Guid>();
        Layout = "container-fluid";
        Gap = "gap-4";
    }
    [JsonIgnore]
    public List<Guid> Columns { get; set; }
    [JsonPropertyName("layout")]
    public string Layout { get; set; }
    [JsonPropertyName("gap")]
    public string Gap { get; set; }
}
