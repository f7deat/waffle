using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models
{
    public class PageVewModel : Catalog
    {
        public PageVewModel()
        {
            ComponentListItems = new List<ComponentListItem>();
            Settings = new PageSettingViewModel();
        }
        public List<ComponentListItem> ComponentListItems { get; set; }
        [JsonPropertyName("settings")]
        public PageSettingViewModel Settings { get; set; }
    }

    public class PageSettingViewModel
    {
        public PageSettingViewModel()
        {
            Title = string.Empty;
        }
        [JsonPropertyName("container")]
        public bool Container { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; }
    }
}
