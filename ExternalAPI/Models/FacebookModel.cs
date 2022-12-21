using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models
{
    public class Facebook
    {
        [JsonPropertyName("appId")]
        public string? AppId { get; set; }
        [JsonPropertyName("appSecret")]
        public string? AppSecret { get; set; }
        [JsonPropertyName("pageAccessToken")]
        public string? PageAccessToken { get; set; }
        [JsonPropertyName("longLivedUserAccessToken")]
        public LongLivedUserAccessToken? LongLivedUserAccessToken { get; set; }
    }
    public class ListResult<T> where T : class
    {
        [JsonPropertyName("data")]
        public List<T>? Data { get; set; }
        [JsonPropertyName("paging")]
        public Paging? Paging { get; set; }
    }

    public class ObjectResult<T> where T : class
    {
        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }

    public class Album
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        [JsonPropertyName("picture")]
        public ObjectResult<Picture>? Picture { get; set; }
        [JsonPropertyName("type")]
        public string? Type { get; set; }
    }
    public class Paging
    {
        [JsonPropertyName("cursors")]
        public Cursors? Cursors { get; set; }
    }
    public class Cursors
    {
        [JsonPropertyName("before")]
        public string? Before { get; set; }
        [JsonPropertyName("after")]
        public string? After { get; set; }
    }
    public class Picture
    {
        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("is_silhouette")]
        public bool IsSilhouette { get; set; }
    }
    public abstract class BaseAccessToken
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
    }

    public class LongLivedUserAccessToken : BaseAccessToken
    {
        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }
        [JsonPropertyName("expires_in")]
        public string? ExpiresIn { get; set; }
    }

    public class LongLivedPageAccessToken
    {
        [JsonPropertyName("data")]
        public LongLivedPageAccessTokenData? Data { get; set; }
    }

    public class LongLivedPageAccessTokenData : BaseAccessToken
    {

    }
}
