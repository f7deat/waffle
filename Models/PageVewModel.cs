using System.Text.Json.Serialization;
using Waffle.Entities;
using Waffle.Models.ViewModels;

namespace Waffle.Models
{
    public class PageVewModel : Catalog
    {
        public PageVewModel()
        {
            ComponentListItems = new List<ComponentListItem>();
            Settings = new CatalogSetting();
        }
        public List<ComponentListItem> ComponentListItems { get; set; }
        [JsonPropertyName("settings")]
        public CatalogSetting Settings { get; set; }
    }
}
