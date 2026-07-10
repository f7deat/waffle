using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository.Careers;
using Waffle.Data;
using Waffle.Entities.Careers;
using Microsoft.EntityFrameworkCore;

namespace Waffle.Infrastructure.Repositories.Careers;

public class JobOpportunityRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<JobOpportunity>(context, hcaService), IJobOpportunityRepository
{
    public async Task<bool> IsExistAsync(string normalizedName, Guid id = default)
    {
        if (id == default) return await _context.JobOpportunities.AnyAsync(x => x.NormalizedName == normalizedName);
        return await _context.JobOpportunities.AnyAsync(x => x.NormalizedName == normalizedName && x.Id != id);
    }
}
