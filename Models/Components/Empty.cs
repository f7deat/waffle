using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Empty
    {
        [JsonIgnore]
        public const string DefaultView = "~/Pages/Shared/Components/Empty/Default.cshtml";
    }
}
