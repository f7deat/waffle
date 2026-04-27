using Waffle.Core.Foundations.Models;
using Waffle.Entities.Careers;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IInfluencerJobService
{
    Task<ListResult<object>> ListAsync(BasicFilterOptions filterOptions);
    Task<TResult> CreateAsync(InfluencerJob args, Guid userId);
    Task<TResult> UpdateAsync(InfluencerJob args, Guid userId);
    Task<TResult> DeleteAsync(Guid id);
    Task<InfluencerJob?> GetAsync(Guid id);
    Task<TResult> ApplyAsync(Guid jobId, Guid influencerId, string? message);
    Task<ListResult<object>> ListApplicationsAsync(Guid jobId, BasicFilterOptions filterOptions);
    Task<ListResult<object>> ListMyApplicationsAsync(Guid influencerId, BasicFilterOptions filterOptions);
}
