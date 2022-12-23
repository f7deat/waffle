using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Waffle.Entities
{
    public abstract class BaseEntity<T>
    {
        [Key, JsonPropertyName("id")]
        public T Id { get; set; }
    }
}
