namespace Waffle.Models.Components
{
    public class Breadcrumb
    {
        public Breadcrumb()
        {
            Icon = "fas fa-folder";
        }
        public string? Url { get; set; }
        public string? Name { get; set; }
        public int Position { get; set; }
        public string Icon { get; set; }
    }
}
