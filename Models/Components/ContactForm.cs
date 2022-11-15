using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class ContactForm : BaseEntity
    {
        public ContactForm()
        {
            Name = string.Empty;
            Email = string.Empty;
            PhoneNumber = string.Empty;
            Note = string.Empty;
            ResultUrl = string.Empty;
            Labels = new ContactFormLabel();
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
        [JsonPropertyName("labels")]
        public ContactFormLabel Labels { get; set; }
    }

    public class ContactFormLabel
    {
        public ContactFormLabel()
        {
            Name = nameof(Name);
            Email = nameof(Email);
            PhoneNumber = "Phone number";
            Note = nameof(Note);
        }

        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; }
        [JsonPropertyName("note")]
        public string Note { get; set; }
    }
}
