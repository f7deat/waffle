namespace Waffle.Entities
{
    public class Catalog : BaseEntity
    {
        public Catalog()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
    }
}
