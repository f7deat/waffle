using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Tag : BaseEntity
    {
        public string? NormalizedName { get; set; }
        public string? Name { get; set; }
    }
}
