using Waffle.Entities;

namespace Waffle.Models.Catalogs
{
    public class ArticleListItem : BaseEntity
    {
        public string? NomalizedName { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Thumbnail { get; set; }
        public int ViewCount { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

}
