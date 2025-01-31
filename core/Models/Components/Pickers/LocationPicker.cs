using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.ViewModels;

namespace Waffle.Models.Components.Pickers;

[Display(Name = "Location Picker", Prompt = nameof(LocationPicker))]
public class LocationPicker : AbstractComponent
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonIgnore]
    public List<CatalogListItem> Locations { get; set; } = [];
}
