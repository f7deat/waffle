using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components
{
    [Display(Name = "Empty")]
    public class Empty : AbstractComponent
    {
        [JsonIgnore]
        public const string DefaultView = "~/Pages/Shared/Components/Empty/Default.cshtml";
    }
}
