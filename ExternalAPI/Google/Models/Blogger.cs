using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Waffle.Entities;

namespace Waffle.ExternalAPI.Google.Models
{
    public class Blogger : BaseEntity
    {
        [JsonPropertyName("apiKey")]
        public string? ApiKey { get; set; }
        [JsonPropertyName("blogId")]
        public string? BlogId { get; set; }
    }

    public class BloggerListResult<T> where T : class
    {
        [JsonPropertyName("nextPageToken")]
        public string? NextPageToken { get; set; }
        [JsonPropertyName("prevPageToken")]
        public string? PrevPageToken { get; set; }
        [JsonPropertyName("items")]
        public List<T>? Items { get; set; }
    }
    public class BloggerItem
    {
        public BloggerItem()
        {
            Content = string.Empty;
            Url = string.Empty;
        }
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        [JsonPropertyName("blog")]
        public Blog? Blog { get; set; }
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("content")]
        public string Content { get; set; }
        [JsonPropertyName("published")]
        public DateTime Published { get; set; }
        [JsonPropertyName("updated")]
        public DateTime Updated { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; }
        public string Image
        {
            get
            {
                var thumbnail = Regex.Match(Content, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
                if (string.IsNullOrEmpty(thumbnail))
                {
                    return "https://picsum.photos/490/200";
                }
                return thumbnail;
            }
        }
        public string Path
        {
            get
            {
                int indexOfSubstring = Url.LastIndexOf("/") + 1;
                return Url[indexOfSubstring..];
            }
        }
        [JsonPropertyName("replies")]
        public BloggerReplies? Replies { get; set; }
        [JsonPropertyName("labels")]
        public List<string>? Labels { get; set; }
    }

    public class BloggerReplies
    {
        [JsonPropertyName("totalItems")]
        public string? TotalItems { get; set; }
    }

    public class Blog
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }

    public class BloggerComment
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
        [JsonPropertyName("updated")]
        public DateTime Updated { get; set; }
        [JsonPropertyName("published")]
        public DateTime Published { get; set; }
        [JsonPropertyName("author")]
        public BloggerAuthor? Author { get; set; }
    }

    public class BloggerAuthor
    {
        [JsonPropertyName("displayName")]
        public string? DisplayName { get; set; }
        [JsonPropertyName("image")]
        public BloggerImage? Image { get; set; }
    }

    public class BloggerImage
    {
        [JsonPropertyName("url")]
        public string? Url { get; set; }
    }
}
