using Waffle.Entities;

namespace Waffle.Core.Foundations;

public class PageData : Catalog
{
    public string? Category { get; set; }
    public string Url
    {
        get
        {
            if (string.IsNullOrEmpty(Category))
            {
                return $"/{Type.ToString().ToLower()}/{NormalizedName}";
            }
            return $"/{Type.ToString().ToLower()}/{Category}/{NormalizedName}";
        }
    }
}
