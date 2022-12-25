namespace Waffle.ExternalAPI.Interfaces
{
    public interface ITelegramService
    {
        Task<bool> SendMessageAsync(string bot, string chatId, string message);
    }
}
