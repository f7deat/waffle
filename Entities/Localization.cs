using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities
{
    public class Localization : BaseEntity
    {
        public Localization()
        {
            Language = "vi-VN";
            Key = string.Empty;
        }
        [Required, StringLength(10)]
        public string Language { get; set; }
        [Required, StringLength(100)]
        public string Key { get; set; }
        public string? Value { get; set; }
    }
}
