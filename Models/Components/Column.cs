using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Column : AbstractComponent
    {
        public Column()
        {
            WorkListItems = new List<WorkListItem>();
            Name = nameof(Column);
        }
        [JsonIgnore]
        public string Name { get; set; }
        [JsonPropertyName("rowId")]
        public Guid RowId { get; set; }
        [JsonPropertyName("catalogId")]
        public Guid CatalogId { get; set; }
        [JsonIgnore]
        public List<WorkListItem> WorkListItems { get; set; }
    }
}
