using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public class Catalog : BaseEntity
    {
        public Catalog()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }
        public Guid? ParentId { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string NormalizedName { get; set; }
        [JsonPropertyName("active")]
        public bool Active { get; set; }
    }
}
