using Waffle.Entities.Careers;
using Waffle.Models;
using Waffle.Models.Result;
using Waffle.Modules.Jobs.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IJobOpportunityService
{
    Task<DefResult> SaveAsync(JobOpportunity args);
    Task<DefResult> DeleteAsync(Guid id);
    Task<JobOpportunity?> GetAsync(Guid id);
    Task<DefResult> ApplyAsync(JobApplication args);
    Task<ListResult<JobApplicationListItem>> ListApplicationAsync(BasicFilterOptions filterOptions);
    Task<DefResult> DeleteApplicationAsync(Guid id);
}
