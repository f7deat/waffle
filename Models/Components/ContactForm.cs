using System.Text.Json.Serialization;

namespace Waffle.Models.Components;

public class ContactForm : AbstractComponent
{
    public ContactForm()
    {
        Name = string.Empty;
        Email = string.Empty;
        PhoneNumber = string.Empty;
        Note = string.Empty;
        ResultUrl = string.Empty;
        ChatId = string.Empty;
    }

    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("email")]
    public string Email { get; set; }
    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; }
    [JsonPropertyName("note")]
    public string Note { get; set; }
    [JsonPropertyName("resultUrl")]
    public string ResultUrl { get; set; }
    [JsonPropertyName("templateId")]
    public string? TemplateId { get; set; }
    [JsonPropertyName("chatId")]
    public string ChatId { get; set; }
}
