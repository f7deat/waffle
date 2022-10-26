namespace Waffle.Entities
{
    public class Component : BaseEntity
    {
        public Component()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
    }
}
