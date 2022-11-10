using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class ContactForm : BaseEntity
    {
        public ContactForm()
        {
            Labels = new ContactFormLabel();
        }
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
        }

        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; }
    }
}
