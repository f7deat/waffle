using Waffle.ExternalAPI.Wiki;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IWikiService
    {
        Task<Parse?> ParseAsync(string page, string lang);
    }
}
