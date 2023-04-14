using Waffle.ExternalAPI.Models;

namespace Waffle.ExternalAPI.Interfaces
{
    public interface IWordPressService
    {
        Task<WordPressPost?> GetPostAsync(string domain, int id);
    }
}
