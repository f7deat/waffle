namespace Waffle.ExternalAPI.Interfaces
{
    public interface ITelegramService
    {
        Task<bool> SendMessageAsync(string token, string chatId, string message);
    }
}
