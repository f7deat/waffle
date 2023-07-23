using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    [Display(Name = "Link", ShortName = "LINK")]
    public class Link : BaseEntity
    {
        public Link()
        {
            Name = Href;
        }

        [JsonPropertyName("href")]
        public string Href { get; set; } = "#";
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("target")]
        public string? Target { get; set; }
    }
}
