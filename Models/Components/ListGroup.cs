namespace Waffle.Models.Components
{
    public class ListGroup
    {
        public ListGroup()
        {
            Items = new List<ListGroupItem>();
        }
        public string? Name { get; set; }
        public IEnumerable<ListGroupItem> Items { get; set; }
    }

    public class ListGroupItem
    {
        public ListGroupItem()
        {
            Icon = "fab fa-staylinked";
            Link = new Link();
        }
        public Link Link { get; set; }
        public string Icon { get; set; }
    }
}
