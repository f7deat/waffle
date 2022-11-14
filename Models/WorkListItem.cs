namespace Waffle.Models
{
    public class WorkListItem
    {
        public WorkListItem()
        {
            Name = string.Empty;
            NormalizedName = string.Empty;
            Arguments = string.Empty;
        }
        /// <summary>
        /// WorkItemId
        /// </summary>
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Arguments { get; set; }
    }
}
