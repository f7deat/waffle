using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class FileItem
    {
        [Key]
        [JsonPropertyName("itemId")]
        public Guid ItemId { get; set; }
        [Key]
        [JsonPropertyName("fileId")]
        public Guid FileId { get; set; }
    }
}
