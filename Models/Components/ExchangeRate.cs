using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Waffle.Core.Foundations;

namespace Waffle.Models.Components
{
    [Display(Name = "Exchange Rate", ShortName = "ExchangeRate")]
    public class ExchangeRate : AbstractComponent
    {
        [JsonIgnore]
        public ExrateList ExrateList { get; set; } = new();
    }


    [XmlRoot(ElementName = "ExrateList")]
    public class ExrateList
    {
        [XmlElement(ElementName = "DateTime")]
        public string? DateTime { get; set; }
        [XmlElement(ElementName = "Exrate")]
        public List<Exrate> Exrate { get; set; } = new();
    }

    public class Exrate
    {
        [XmlAttribute(AttributeName = "CurrencyCode")]
        public string? CurrencyCode { get; set; }

        [XmlAttribute(AttributeName = "CurrencyName")]
        public string? CurrencyName { get; set; }

        [XmlAttribute(AttributeName = "Buy")]
        public string? Buy { get; set; }

        [XmlAttribute(AttributeName = "Transfer")]
        public string? Transfer { get; set; }

        [XmlAttribute(AttributeName = "Sell")]
        public string? Sell { get; set; }
    }
}
