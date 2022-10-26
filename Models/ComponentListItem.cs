namespace Waffle.Models
{
    public class ComponentListItem
    {
        public ComponentListItem()
        {
            Name = string.Empty;
            Arguments= string.Empty;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Arguments { get; set; }
    }
}
