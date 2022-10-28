namespace Waffle.Models
{
    public class WorkListItem
    {
        public WorkListItem()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
        }
        public Guid WorkId { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
    }
}
