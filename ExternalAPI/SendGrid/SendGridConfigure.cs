using System.Text.Json.Serialization;

namespace Waffle.ExternalAPI.SendGrid
{
    public class SendGridConfigure
    {
        public SendGridConfigure()
        {
            ApiKey = string.Empty;
            From = new SendGridConfigureFrom();
        }

        [JsonPropertyName("apiKey")]
        public string ApiKey { get; set; }
        [JsonPropertyName("from")]
        public SendGridConfigureFrom From { get; set; }
    }
    public class SendGridConfigureFrom
    {
        public SendGridConfigureFrom()
        {
            Email = string.Empty;
            Name = string.Empty;
        }

        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
