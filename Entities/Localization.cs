using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities
{
    public class Localization : BaseEntity<Guid>
    {
        public Localization()
        {
            Language = string.Empty;
            Key = string.Empty;
        }
        [Required]
        public string Language { get; set; }
        [Required]
        public string Key { get; set; }
        public string? Value { get; set; }
    }
}
