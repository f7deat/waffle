using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    [Display(Name = "Google Map")]
    public class GoogleMap
    {
        [JsonPropertyName("height")]
        public int Height { get; set; }
        [JsonPropertyName("address")]
        public string? Address { get; set; }
        [JsonPropertyName("email")]
        public string? Email { get; set; }
        [JsonPropertyName("src")]
        public string? Src { get; set; }
    }
}
