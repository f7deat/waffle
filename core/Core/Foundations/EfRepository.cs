using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Waffle.Core.Interfaces;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Core.Foundations;

/// <summary>
/// "There's some repetition here - couldn't we have some the sync methods call the async?"
/// https://blogs.msdn.microsoft.com/pfxteam/2012/04/13/should-i-expose-synchronous-wrappers-for-asynchronous-methods/
/// </summary>
/// <typeparam name="T"></typeparam>
public class EfRepository<T>(ApplicationDbContext context, IHCAService hcaService) : IAsyncRepository<T> where T : class
{
    protected readonly ApplicationDbContext _context = context;
    protected readonly IHCAService _hcaService = hcaService;

    public async Task<T?> FindAsync(object id) => await _context.Set<T>().FindAsync(id);

    /// <inheritdoc/>
    public async Task<IReadOnlyList<T>> ListAsync() => await _context.Set<T>().ToListAsync();

    public async Task<T> AddAsync(T entity)
    {
        if (entity is IAuditEntity auditEntity)
        {
            auditEntity.CreatedDate = DateTime.UtcNow;
            auditEntity.CreatedBy = _hcaService.GetUserId();
        }
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        if (entity is IAuditEntity auditEntity)
        {
            auditEntity.ModifiedDate = DateTime.UtcNow;
            auditEntity.ModifiedBy = _hcaService.GetUserId();
        }
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(T entity)
    {
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
    }
    public IDbContextTransaction BeginTransaction() => _context.Database.BeginTransaction();

    public async Task<int> CountAsync() => await _context.Set<T>().CountAsync();

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public async Task<int> AddRangeAsync(IReadOnlyList<T> entities)
    {
        await _context.Set<T>().AddRangeAsync(entities);
        return await _context.SaveChangesAsync();
    }

    public async Task<bool> AnyAsync() => await _context.Set<T>().AnyAsync();

    public IQueryable<T> Queryable() => _context.Set<T>();
}
