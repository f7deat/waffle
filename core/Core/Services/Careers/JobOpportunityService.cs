using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository.Careers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Careers;
using Waffle.Models;
using Waffle.Modules.Jobs.Models;

namespace Waffle.Core.Services.Careers;

public class JobOpportunityService(ApplicationDbContext _context, IJobOpportunityRepository _jobOpportunityRepository, IHCAService _hcaService, ILogService _logService) : IJobOpportunityService
{
    public async Task<TResult> ApplyAsync(JobApplication args)
    {
        var job = await _jobOpportunityRepository.FindAsync(args.JobId);
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
        await _context.SaveChangesAsync();
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

    public async Task<TResult> UpdateApplicationStatusAsync(Guid id, JobApplicationStatus status)
    {
        var application = await _context.JobApplications.FindAsync(id);
        if (application is null) return TResult.Failed("Job application not found!");
        application.Status = status;
        application.ModifiedDate = DateTime.Now;
        await _context.SaveChangesAsync();
        return TResult.Success;
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
                        ApplicationCount = _context.JobApplications.Count(x => x.JobId == a.Id),
                        a.ViewCount,
                        a.Title,
                        a.Description,
                        a.Status
                    };
        query = query.OrderByDescending(x => x.ModifiedDate);
        return await ListResult<object>.Success(query, filterOptions);
    }

    public async Task<TResult> UpdateAsync(JobOpportunity args)
    {
		try
		{
            var job = await _context.JobOpportunities.FirstOrDefaultAsync(x => x.Id == args.Id);
            if (job is null) return TResult.Failed("Job opportunity not found!");
            if (string.IsNullOrWhiteSpace(args.JobDetail)) return TResult.Failed("Job opportunity detail is required!");
            job.NormalizedName = SeoHelper.ToSeoFriendly(args.Title);
            if (!await _jobOpportunityRepository.IsExistAsync(job.NormalizedName, job.Id)) return TResult.Failed("Job opportunity title already exists!");
            job.JobRequirements = args.JobRequirements;
            job.JobDetail = JsonSerializer.Serialize(args.JobDetail);
            job.Description = args.Description;
            job.Status = args.Status;
            job.Title = args.Title;
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

    public async Task<TResult> AddAsync(JobOpportunity args)
    {
        var normalizedName = SeoHelper.ToSeoFriendly(args.Title);
        if (await _jobOpportunityRepository.IsExistAsync(normalizedName)) return TResult.Failed("Job opportunity title already exists!");
        await _jobOpportunityRepository.AddAsync(new JobOpportunity
        {
            CreatedBy = _hcaService.GetUserId(),
            CreatedDate = DateTime.Now,
            Title = args.Title,
            NormalizedName = normalizedName,
            JobType = args.JobType,
            Description = args.Description,
            Status = JobStatus.Draft
        });
        return TResult.Success;
    }

    public async Task<TResult> GetByIdAsync(Guid id)
    {
        var job = await _jobOpportunityRepository.FindAsync(id);
        if (job is null) return TResult.Failed("Data not found!");
        return TResult.Ok(new
        {
            job.Id,
            job.Title,
            job.Description,
            Detail = string.IsNullOrEmpty(job.JobDetail) ? null : JsonSerializer.Deserialize<object>(job.JobDetail),
            job.JobType,
            job.Status,
        });
    }
}
