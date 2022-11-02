using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Row
    {
        public Row()
        {
            Cols = new List<Guid>();
        }
        [JsonPropertyName("cols")]
        public List<Guid> Cols { get; set; }
    }
}
