using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Header : BaseEntity
    {
        public Header()
        {
            Logo = string.Empty;
            Template = "Default";
        }
        [JsonPropertyName("logo")]
        public string Logo { get; set; }
        [JsonPropertyName("template")]
        public string Template { get; set; }

        [JsonIgnore]
        public static List<Option> Templates = new()
        {
            new Option { Label = "Default", Value= "~/Views/Shared/Components/Header/Default.cshtml" },
            new Option { Label = "DLiTi", Value= "~/Views/Shared/Components/Header/DLiTi.cshtml" }
        };
    }
}
