using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Row
    {
        public Row()
        {
            Columns = new List<Guid>();
        }
        [JsonPropertyName("cols")]
        public List<Guid> Columns { get; set; }
    }
}
