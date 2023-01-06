using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Footer : BaseEntity
    {
        public Footer()
        {
            CompanyName = "Your Company";
            Email = "Your Email";
            PhoneNumber = "Your Phone number";
            Social = new Social();
        }
        [JsonPropertyName("companyName")]
        public string CompanyName { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; }
        [JsonPropertyName("social")]
        public Social Social { get; set; }
    }
}
