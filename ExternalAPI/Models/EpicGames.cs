using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.Models
{
    public class EpicGamesFreeGamesPromotions
    {
        [JsonPropertyName("data")]
        public EpicGamesFreeGamesPromotionsData Data { get; set; } = new();
    }

    public class EpicGamesFreeGamesPromotionsData
    {
        public EpicGamesCatalog Catalog { get; set; } = new();
    }

    public class EpicGamesCatalog
    {
        [JsonPropertyName("searchStore")]
        public EpicGamesSearchStore SearchStore { get; set; } = new();
    }

    public class EpicGamesSearchStore
    {
        [JsonPropertyName("elements")]
        public List<EpicGamesElement> Elements { get; set; } = new();
    }

    public class EpicGamesElement
    {
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        [JsonPropertyName("description")]
        public string? Description { get; set; }
        [JsonPropertyName("keyImages")]
        public List<EpicGamesKeyImage> EpicGamesKeyImages { get; set; } = new();
        [JsonPropertyName("urlSlug")]
        public string? UrlSlug { get; set; }
        [JsonPropertyName("price")]
        public EpicGamesPrice Price { get; set; } = new();

        [JsonIgnore]
        public string Thumbnail => EpicGamesKeyImages.First(x => x.Type == "Thumbnail").Url ?? string.Empty;
    }

    public class EpicGamesKeyImage
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("url")]
        public string? Url { get; set; }
    }

    public class EpicGamesPrice
    {
        [JsonPropertyName("totalPrice")]
        public EpicGamesTotalPrice TotalPrice { get; set; } = new();
    }

    public class EpicGamesTotalPrice
    {
        [JsonPropertyName("fmtPrice")]
        public EpicGamesPriceFmt FmtPrice { get; set; } = new();
    }

    public class EpicGamesPriceFmt
    {
        [JsonPropertyName("originalPrice")]
        public string? OriginalPrice { get; set; }
    }
}
