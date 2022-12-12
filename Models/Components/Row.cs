using System.Text.Json.Serialization;

namespace Waffle.Models.Components
{
    public class Row : AbstractComponent
    {
        public Row()
        {
            Columns = new List<Guid>();
            Layout = "container-fluid";
        }
        [JsonIgnore]
        public List<Guid> Columns { get; set; }
        [JsonPropertyName("layout")]
        public string Layout { get; set; }
    }
}
