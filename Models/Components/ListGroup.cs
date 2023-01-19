namespace Waffle.Models.Components
{
    public class ListGroup
    {
        public ListGroup()
        {
            Items = new List<ListGroupItem>();
        }
        public IEnumerable<ListGroupItem> Items { get; set; }
    }

    public class ListGroupItem
    {
        public ListGroupItem()
        {
            Name = string.Empty;
            Url = string.Empty;
            Icon = "fab fa-staylinked";
        }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
    }
}
