using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Column
    {
        public Column()
        {
            Value = string.Empty;
            WorkListItems = new List<WorkListItem>();
        }
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        public string Value { get; set; }
        public List<WorkListItem> WorkListItems { get; set; }
    }
}
