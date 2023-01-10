using System.Text.Json.Serialization;
using Waffle.Entities;
using Waffle.Models.Catalogs;

namespace Waffle.Models.Components
{
    public class Feed : BaseEntity
    {
        public string? Name { get; set; }
        [JsonIgnore]
        public IEnumerable<ArticleListItem>? Articles { get; set; }
    }
}
