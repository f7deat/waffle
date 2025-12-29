using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Careers;
using Waffle.Models;
using Waffle.Models.Result;
using Waffle.Modules.Jobs.Models;

namespace Waffle.Core.Services.Careers;

public class JobOpportunityService(ApplicationDbContext _context, IHCAService _hcaService, ILogService _logService) : IJobOpportunityService
{
    public async Task<TResult> ApplyAsync(JobApplication args)
    {
        var job = await _context.JobOpportunities.FindAsync(args.JobId);
        if (job is null) return TResult.Failed("Job opportunity not found!");
        var application = new JobApplication
        {
            JobId = args.JobId,
            CandidateId = _hcaService.GetUserId(),
            AppliedDate = DateTime.Now,
            Status = JobApplicationStatus.Pending
        };
        await _context.JobApplications.AddAsync(application);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteApplicationAsync(Guid id)
    {
        var application = await _context.JobApplications.FindAsync(id);
        if (application is null) return TResult.Failed("Job application not found!");
        _context.JobApplications.Remove(application);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var job = await _context.JobOpportunities.FindAsync(id);
        if (job is null) return TResult.Success;
        if (await _context.JobApplications.AnyAsync(x => x.JobId == id)) return TResult.Failed("Job opportunity has applications!");
        _context.JobOpportunities.Remove(job);
        return TResult.Success;
    }

    public async Task<JobOpportunity?> GetAsync(Guid id) => await _context.JobOpportunities.FindAsync(id);

    public async Task<ListResult<JobApplicationListItem>> ListApplicationAsync(BasicFilterOptions filterOptions)
    {
        var query = from a in _context.JobApplications
                    join b in _context.JobOpportunities on a.JobId equals b.Id
                    join c in _context.Users on a.CandidateId equals c.Id
                    join d in _context.Catalogs on b.Id equals d.Id
                    select new JobApplicationListItem
                    {
                        Id = a.Id,
                        JobId = a.JobId,
                        JobTitle = d.Name,
                        CandidateId = a.CandidateId,
                        CandidateName = c.Name,
                        AppliedDate = a.AppliedDate,
                        Status = a.Status,
                        ResumeFile = a.ResumeFile
                    };
        query = query.OrderByDescending(x => x.AppliedDate);
        return await ListResult<JobApplicationListItem>.Success(query, filterOptions);
    }

    public async Task<ListResult<object>> ListAsync(BasicFilterOptions filterOptions)
    {
        var query = from a in _context.JobOpportunities
                    select new
                    {
                        a.Id,
                        a.JobRequirements,
                        a.SalaryRange,
                        a.JobLocation,
                        a.JobType,
                        a.CreatedDate,
                        a.CreatedBy,
                        a.ModifiedDate,
                        a.ModifiedBy,
                        ApplicationCount = _context.JobApplications.Count(x => x.JobId == a.Id)
                    };
        query = query.OrderByDescending(x => x.CreatedDate);
        return await ListResult<object>.Success(query, filterOptions);
    }

    public async Task<TResult> SaveAsync(JobOpportunity args)
    {
		try
		{
            var job = await _context.JobOpportunities.FirstOrDefaultAsync(x => x.Id == args.Id);
            if (job is null)
            {
                job = new JobOpportunity
                {
                    Id = args.Id,
                    JobRequirements = args.JobRequirements,
                    SalaryRange = args.SalaryRange,
                    JobLocation = args.JobLocation,
                    JobType = args.JobType,
                    CreatedDate = DateTime.Now,
                    CreatedBy = _hcaService.GetUserId()
                };
                await _context.JobOpportunities.AddAsync(job);
                await _context.SaveChangesAsync();
                return TResult.Success;
            }
            job.JobRequirements = args.JobRequirements;
            job.SalaryRange = args.SalaryRange;
            job.JobLocation = args.JobLocation;
            job.JobType = args.JobType;
            job.ModifiedDate = DateTime.Now;
            job.ModifiedBy = _hcaService.GetUserId();
            await _context.SaveChangesAsync();
            return TResult.Success;
        }
		catch (Exception ex)
		{
            await _logService.ExceptionAsync(ex);
            return TResult.Failed(ex.ToString());
		}
    }
}
