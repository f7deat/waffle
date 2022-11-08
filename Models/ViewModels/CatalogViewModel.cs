using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.ViewModels
{
    public class CatalogViewModel : BaseEntity
    {
        public CatalogViewModel()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
            Description = string.Empty;
            Setting = new CatalogSetting();
        }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("normalizedName")]
        public string NormalizedName { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("setting")]
        public CatalogSetting Setting { get; set; }
    }

    public class CatalogSetting
    {
        public CatalogSetting()
        {
            Title = string.Empty;
        }
        [JsonPropertyName("title")]
        public string Title { get; set; }
    }
}
