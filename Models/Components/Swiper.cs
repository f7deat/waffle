using System.Text.Json.Serialization;
using Waffle.Entities;

namespace Waffle.Models.Components
{
    public class Swiper : AbstractComponent
    {
        public Swiper()
        {
            Images = new List<Image>();
        }

        [JsonPropertyName("images")]
        public List<Image> Images { get; set; }
    }

    public class AddSwiperItem : BasicWorkContent
    {
    }
}
