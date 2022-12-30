using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Column : AbstractComponent
    {
        public Column()
        {
            WorkListItems = new List<WorkListItem>();
        }
        [JsonPropertyName("rowId")]
        public Guid RowId { get; set; }
        [JsonPropertyName("catalogId")]
        public Guid CatalogId { get; set; }
        [JsonIgnore]
        public List<WorkListItem> WorkListItems { get; set; }
    }
}
