using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Navbar : BaseEntity
    {
        public Navbar()
        {
            NavItems = new List<NavItem>();
        }
        [JsonPropertyName("container")]
        public bool Container { get; set; }
        [JsonPropertyName("navItems")]
        public List<NavItem> NavItems { get; set; }
    }
    public class NavItem
    {
        public NavItem()
        {
            Url = string.Empty;
            Name = string.Empty;
        }
        [JsonPropertyName("url")]
        public string Url { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
