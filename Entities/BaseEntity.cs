using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public abstract class BaseEntity
    {
        [Key, JsonPropertyName("id")]
        public Guid Id { get; set; }
    }
}
