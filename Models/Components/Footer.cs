using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Footer : BaseEntity
    {
        public Footer()
        {
            CompanyName = "Your Company";
        }
        [JsonPropertyName("companyName")]
        public string CompanyName { get; set; }
    }
}
