using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;
using Waffle.Models.Components;

namespace Waffle.Models.Settings;

[Display(Name = "Header", Prompt = nameof(Header), AutoGenerateFilter = true)]
public class Header : BaseSetting
{
    [JsonPropertyName("brand")]
    public string? Brand { get; set; }
    [JsonPropertyName("logo")]
    public string? Logo { get; set; }

    [JsonPropertyName("topMenu")]
    public IEnumerable<Link>? TopMenu { get; set; }

    [JsonPropertyName("navBar")]
    public IEnumerable<NavItem>? NavItems { get; set; }

    public string? SearchPlaceHolder { get; set; }

    [JsonIgnore]
    public bool IsAuthenticated { get; set; }

    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public PageData PageData { get; set; } = new();
}
