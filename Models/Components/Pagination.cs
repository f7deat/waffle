namespace Waffle.Models.Components
{
    public class Pagination : FilterOptions, IFilterOptions
    {
        public bool HasPrevPage { get; set; }
        public bool HasNextPage { get; set; }
        public string? NextPageUrl { get; set; }
        public string? PrevPageUrl { get; set; }
        public int Total { get; set; }
    }
}
