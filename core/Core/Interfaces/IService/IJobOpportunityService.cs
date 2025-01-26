using Waffle.Entities.Careers;
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IJobOpportunityService
{
    Task<DefResult> SaveAsync(JobOpportunity args);
}
