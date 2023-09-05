namespace Waffle.ExternalAPI.Interfaces
{
    public interface ITelegramService
    {
        Task<bool> SendMessageAsync(string token, string? chatId, string message);
        Task<bool> SendMessageAsync(string message);
        Task<bool> SendErrorAsync(string message);
    }
}
