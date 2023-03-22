namespace Waffle.Models.Components
{
    public class ListGroup
    {
        public ListGroup()
        {
            Items = new List<ListGroupItem>();
        }
        public string? Name { get; set; }
        public bool HasBadge { get; set; }
        public IEnumerable<ListGroupItem> Items { get; set; }
    }

    public class ListGroupItem
    {
        public Link Link { get; set; } = new();
        public string Icon { get; set; } = "fab fa-staylinked";
        public int Badge { get; set; }
        public string Suffix { get; set; } = string.Empty;
        public bool HasSuffix => !string.IsNullOrEmpty(Suffix);
    }
}
