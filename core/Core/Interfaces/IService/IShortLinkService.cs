using Waffle.Core.Foundations.Models;
using Waffle.Entities;

namespace Waffle.Core.Interfaces.IService;

public interface IShortLinkService
{
    Task<TResult> CreateAsync(string url);
    Task<IReadOnlyList<ShortLink>> ListAsync();
    Task<TResult> DeleteAsync(Guid id);
    Task<TResult> ClearAsync();
    Task<ShortLink?> GetByCodeAsync(string code);
    Task TrackAccessAsync(Guid id);
}
