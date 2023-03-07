using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models
{
    public class BackupListItems
    {
        public BackupListItems()
        {
            WorkContents = new List<WorkContent>();
            WorkItems = new List<WorkItem>();
            FileContents = new List<FileContent>();
            AppSettings = new List<AppSetting>();
            Catalogs = new List<Catalog>();
            Components = new List<Component>();
            Localizations = new List<Localization>();
        }
        [JsonPropertyName("workContents")]
        public List<WorkContent> WorkContents { get; set; }
        [JsonPropertyName("workItems")]
        public List<WorkItem> WorkItems { get; set; }
        [JsonPropertyName("fileContents")]
        public List<FileContent> FileContents { get; set; }
        [JsonPropertyName("appSettings")]
        public List<AppSetting> AppSettings { get; set; }
        [JsonPropertyName("catalogs")]
        public List<Catalog> Catalogs { get; set; }
        [JsonPropertyName("components")]
        public List<Component> Components { get; set; }
        [JsonPropertyName("localizations")]
        public List<Localization> Localizations { get; set; }
    }
}
