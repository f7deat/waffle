using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities.Careers;

namespace Waffle.Core.Interfaces.IRepository.Careers;

public interface IJobOpportunityRepository : IAsyncRepository<JobOpportunity>
{
    Task<bool> IsExistAsync(string normalizedName, Guid id = default);
}
