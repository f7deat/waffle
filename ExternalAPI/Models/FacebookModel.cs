﻿using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models
{
    public class Facebook
    {
        [JsonPropertyName("appId")]
        public string AppId { get; set; } = string.Empty;
        [JsonPropertyName("appSecret")]
        public string AppSecret { get; set; } = string.Empty;
        [JsonPropertyName("pageAccessToken")]
        public string PageAccessToken { get; set; } = string.Empty;
        [JsonPropertyName("longLivedUserAccessToken")]
        public LongLivedUserAccessToken LongLivedUserAccessToken { get; set; } = new LongLivedUserAccessToken();
        [JsonPropertyName("pageId")]
        public string PageId { get; set; } = string.Empty;
        [JsonPropertyName("shortLiveToken")]
        public string ShortLiveToken { get; set; } = string.Empty;
    }
    public class FacebookListResult<T> where T : class
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
        public BaseAccessToken()
        {
            AccessToken = string.Empty;
        }
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
    }

    public class LongLivedUserAccessToken : BaseAccessToken
    {
        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }
    }

    public class LongLivedPageAccessToken
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
    }

    public class LongLivedPageAccessTokenData : BaseAccessToken
    {

    }
}
