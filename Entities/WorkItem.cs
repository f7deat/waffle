namespace Waffle.Entities
{
    public class WorkItem
    {
        public Guid WorkContentId { get; set; }
        public Guid CatalogId { get; set; }
        public int SortOrder { get; set; }
    }
}
