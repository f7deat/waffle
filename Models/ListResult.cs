using System.Text.Json.Serialization;

namespace Waffle.Models
{
    public class ListResult<T> where T : class
    {
        [JsonPropertyName("data")]
        public IEnumerable<T>? Data { get; set; }
        [JsonPropertyName("total")]
        public int Total { get; set; }
    }
}
