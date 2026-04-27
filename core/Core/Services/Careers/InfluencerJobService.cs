using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities.Careers;
using Waffle.Models;

namespace Waffle.Core.Services.Careers;

public class InfluencerJobService(ApplicationDbContext _context) : IInfluencerJobService
{
    public async Task<ListResult<object>> ListAsync(BasicFilterOptions filterOptions)
    {
        try
        {
            var query = from j in _context.InfluencerJobs
                        join u in _context.Users on j.CreatedBy equals u.Id
                        where j.Status == InfluencerJobStatus.Open
                        select new
                        {
                            j.Id,
                            j.Title,
                            j.Description,
                            j.Budget,
                            j.BudgetMax,
                            j.ContentType,
                            j.Category,
                            j.Deadline,
                            j.RequiredFollowers,
                            j.Brand,
                            j.Status,
                            j.CreatedDate,
                            CreatedByName = u.Name ?? u.UserName,
                            CreatedByAvatar = u.Avatar,
                            ApplicationCount = _context.InfluencerJobApplications.Count(a => a.JobId == j.Id)
                        };
            query = query.OrderByDescending(x => x.CreatedDate);
            return await ListResult<object>.Success(query, filterOptions);
        }
        catch (Exception ex)
        {
            return ListResult<object>.Failed(ex.ToString());
        }
    }

    public async Task<TResult> CreateAsync(InfluencerJob args, Guid userId)
    {
        var job = new InfluencerJob
        {
            Title = args.Title,
            Description = args.Description,
            Budget = args.Budget,
            BudgetMax = args.BudgetMax,
            ContentType = args.ContentType,
            Category = args.Category,
            Deadline = args.Deadline,
            RequiredFollowers = args.RequiredFollowers,
            Brand = args.Brand,
            Status = InfluencerJobStatus.Open,
            CreatedBy = userId,
            CreatedDate = DateTime.UtcNow
        };
        await _context.InfluencerJobs.AddAsync(job);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> UpdateAsync(InfluencerJob args, Guid userId)
    {
        var job = await _context.InfluencerJobs.FindAsync(args.Id);
        if (job is null) return TResult.Failed("Job not found!");
        if (job.CreatedBy != userId) return TResult.Failed("You do not have permission to update this job.");
        job.Title = args.Title;
        job.Description = args.Description;
        job.Budget = args.Budget;
        job.BudgetMax = args.BudgetMax;
        job.ContentType = args.ContentType;
        job.Category = args.Category;
        job.Deadline = args.Deadline;
        job.RequiredFollowers = args.RequiredFollowers;
        job.Brand = args.Brand;
        job.Status = args.Status;
        job.ModifiedBy = userId;
        job.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var job = await _context.InfluencerJobs.FindAsync(id);
        if (job is null) return TResult.Failed("Job not found!");
        if (await _context.InfluencerJobApplications.AnyAsync(a => a.JobId == id))
            return TResult.Failed("Cannot delete a job that has applications.");
        _context.InfluencerJobs.Remove(job);
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<InfluencerJob?> GetAsync(Guid id) => await _context.InfluencerJobs.FindAsync(id);

    public async Task<TResult> ApplyAsync(Guid jobId, Guid influencerId, string? message)
    {
        var job = await _context.InfluencerJobs.FindAsync(jobId);
        if (job is null || job.Status != InfluencerJobStatus.Open)
            return TResult.Failed("Job is not available.");
        var alreadyApplied = await _context.InfluencerJobApplications
            .AnyAsync(a => a.JobId == jobId && a.InfluencerId == influencerId);
        if (alreadyApplied) return TResult.Failed("You have already applied for this job.");
        await _context.InfluencerJobApplications.AddAsync(new InfluencerJobApplication
        {
            JobId = jobId,
            InfluencerId = influencerId,
            Message = message,
            AppliedDate = DateTime.UtcNow,
            Status = InfluencerJobApplicationStatus.Pending
        });
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<ListResult<object>> ListApplicationsAsync(Guid jobId, BasicFilterOptions filterOptions)
    {
        var query = from a in _context.InfluencerJobApplications
                    join u in _context.Users on a.InfluencerId equals u.Id
                    where a.JobId == jobId
                    select new
                    {
                        a.Id,
                        a.JobId,
                        a.InfluencerId,
                        InfluencerName = u.Name ?? u.UserName,
                        InfluencerAvatar = u.Avatar,
                        a.Message,
                        a.AppliedDate,
                        a.Status
                    };
        query = query.OrderByDescending(x => x.AppliedDate);
        return await ListResult<object>.Success(query, filterOptions);
    }

    public async Task<ListResult<object>> ListMyApplicationsAsync(Guid influencerId, BasicFilterOptions filterOptions)
    {
        var query = from a in _context.InfluencerJobApplications
                    join j in _context.InfluencerJobs on a.JobId equals j.Id
                    join u in _context.Users on j.CreatedBy equals u.Id
                    where a.InfluencerId == influencerId
                    select new
                    {
                        a.Id,
                        a.JobId,
                        a.AppliedDate,
                        a.Message,
                        ApplicationStatus = a.Status,
                        j.Title,
                        j.Brand,
                        j.Budget,
                        j.BudgetMax,
                        j.ContentType,
                        j.Category,
                        j.Deadline,
                        JobStatus = j.Status,
                        j.CreatedDate,
                        PostedByName = u.Name ?? u.UserName
                    };
        query = query.OrderByDescending(x => x.AppliedDate);
        return await ListResult<object>.Success(query, filterOptions);
    }
}
