namespace Waffle.ExternalAPI.Interfaces
{
    public interface IGoogleService
    {
        Task<Stream> GetDailyTrendingAsync();
    }
}
