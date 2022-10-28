namespace Waffle.Models
{
    public class WorkListItem
    {
        public WorkListItem()
        {
            Name = string.Empty;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
