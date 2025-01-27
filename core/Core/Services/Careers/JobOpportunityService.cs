using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Careers;
using Waffle.Models.Result;

namespace Waffle.Core.Services.Careers;

public class JobOpportunityService(ApplicationDbContext _context, ICurrentUser _currentUser) : IJobOpportunityService
{
    public async Task<DefResult> DeleteAsync(Guid id)
    {
        var job = await _context.JobOpportunities.FindAsync(id);
        if (job is null) return DefResult.Success;
        if (await _context.JobApplications.AnyAsync(x => x.JobId == id)) return DefResult.Failed("Job opportunity has applications!");
        _context.JobOpportunities.Remove(job);
        return DefResult.Success;
    }

    public async Task<DefResult> SaveAsync(JobOpportunity args)
    {
        var job = await _context.JobOpportunities.FirstOrDefaultAsync(x => x.Id == args.Id);
        if (job is null)
        {
            job = new JobOpportunity
            {
                JobTitle = args.JobTitle,
                JobDescription = args.JobDescription,
                JobRequirements = args.JobRequirements,
                SalaryRange = args.SalaryRange,
                JobLocation = args.JobLocation,
                JobType = args.JobType,
                CreatedDate = DateTime.Now,
                CreatedBy = _currentUser.GetId()
            };
            await _context.JobOpportunities.AddAsync(job);
            await _context.SaveChangesAsync();
            return DefResult.Success;
        }
        job.JobTitle = args.JobTitle;
        job.JobDescription = args.JobDescription;
        job.JobRequirements = args.JobRequirements;
        job.SalaryRange = args.SalaryRange;
        job.JobLocation = args.JobLocation;
        job.JobType = args.JobType;
        job.ModifiedDate = DateTime.Now;
        job.ModifiedBy = _currentUser.GetId();
        await _context.SaveChangesAsync();
        return DefResult.Success;
    }
}
