namespace Waffle.Entities
{
    public class WorkItem : BaseEntity
    {
        public WorkItem()
        {
            Arguments = string.Empty;
        }
        public string Arguments { get; set; }
        public Guid ComponentId { get; set; }
        public Guid CatalogId { get; set; }
    }
}
