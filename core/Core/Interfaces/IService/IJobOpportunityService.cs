using Waffle.Core.Foundations.Models;
using Waffle.Entities.Careers;
using Waffle.Models;
using Waffle.Modules.Jobs.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IJobOpportunityService
{
    Task<TResult> SaveAsync(JobOpportunity args);
    Task<TResult> DeleteAsync(Guid id);
    Task<JobOpportunity?> GetAsync(Guid id);
    Task<TResult> ApplyAsync(JobApplication args);
    Task<ListResult<JobApplicationListItem>> ListApplicationAsync(BasicFilterOptions filterOptions);
    Task<TResult> DeleteApplicationAsync(Guid id);
    Task<ListResult<object>> ListAsync(BasicFilterOptions filterOptions);
}
