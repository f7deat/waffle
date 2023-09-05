using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components;

public class ContactForm : AbstractComponent
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    [JsonPropertyName("note")]
    public string? Note { get; set; }
    [JsonPropertyName("resultUrl")]
    public string? ResultUrl { get; set; }
    [JsonPropertyName("templateId")]
    public string? TemplateId { get; set; }
    [JsonPropertyName("chatId")]
    public string? ChatId { get; set; }
}
