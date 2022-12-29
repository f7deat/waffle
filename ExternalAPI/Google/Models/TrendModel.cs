using System.Xml.Serialization;

namespace Waffle.ExternalAPI.Google.Models
{
    [XmlRoot(ElementName = "rss")]
    public class TrendModel
    {
        [XmlElement("channel")]
        public Channel? Channel { get; set; }
    }

    public class Channel
    {
        [XmlElement("item")]
        public List<ChannelItem>? Item { get; set; }
    }

    public class ChannelItem
    {
        [XmlElement("title")]
        public string? Title { get; set; }
        [XmlElement("description")]
        public string? Description { get; set; }
    }
}
