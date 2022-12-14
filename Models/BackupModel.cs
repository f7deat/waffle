using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models
{
    public class BackupModel
    {
        [JsonPropertyName("workContents")]
        public List<WorkContent>? WorkContents { get; set; }
        [JsonPropertyName("workItems")]
        public List<WorkItem>? WorkItems { get; set; }
        [JsonPropertyName("fileContents")]
        public List<FileContent>? FileContents { get; set; }
        [JsonPropertyName("fileItems")]
        public List<FileItem>? FileItems { get; set; }
        [JsonPropertyName("appSettings")]
        public List<AppSetting>? AppSettings { get; set; }
        [JsonPropertyName("catalogs")]
        public List<Catalog>? Catalogs { get; set; }
        [JsonPropertyName("components")]
        public List<Component>? Components { get; set; }
    }
}
