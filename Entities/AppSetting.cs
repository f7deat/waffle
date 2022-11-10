using System.ComponentModel.DataAnnotations;

namespace Waffle.Entities
{
    public class AppSetting : BaseEntity
    {
        public AppSetting()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
            Value = string.Empty;
            Description = string.Empty;
        }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string NormalizedName { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        public string Value { get; set; }
    }
}
