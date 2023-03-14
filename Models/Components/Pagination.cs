namespace Waffle.Models.Components
{
    public class Pagination
    {
        public Pagination()
        {
            NextPageUrl = string.Empty;
            PrevPageUrl = string.Empty;
        }
        public bool HasPrevPage { get; set; }
        public bool HasNextPage { get; set; }
        public string NextPageUrl { get; set; }
        public string PrevPageUrl { get; set; }
    }
}
