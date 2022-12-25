using Waffle.ExternalAPI.Interfaces;

namespace Waffle.ExternalAPI.Telegram
{
    public class TelegramService : ITelegramService
    {
        private readonly HttpClient _httpClient;
        public TelegramService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<bool> SendMessageAsync(string bot, string chatId, string message)
        {
            try
            {
                await _httpClient.GetAsync($"https://api.telegram.org/{bot}/sendMessage?chat_id={chatId}&text={message}&parse_mode=HTML&disable_web_page_preview=true");
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}