using System.Text.Json;

namespace Waffle.Models.Website;

public class WebsitePageUpdateArgs
{
    public JsonElement Content { get; set; }
    public bool IsPublished { get; set; }
}