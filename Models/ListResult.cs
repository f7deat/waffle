using System.Text.Json.Serialization;

namespace Waffle.Models
{
    public class ListResult<T> where T : class
    {
        [JsonPropertyName("data")]
        public IEnumerable<T>? Data { get; set; }
        [JsonPropertyName("total")]
        public int Total { get; set; }
        [JsonPropertyName("succeeded")]
        public bool Succeeded { get; }
        public ListResult(IEnumerable<T> data, int total)
        {
            Data = data;
            Succeeded = true;
            Total = total;
        }
        public static ListResult<T> Success(IEnumerable<T> data, int total)
        {
            return new ListResult<T>(data, total);
        }
    }
}
