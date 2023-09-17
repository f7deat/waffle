using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class ComponentRepository : EfRepository<Component>, IComponentRepository
{
    public ComponentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Component>> ListAsync(SearchFilterOptions filterOptions)
    {
        return await _context.Components.Where(x => (string.IsNullOrEmpty(filterOptions.SearchTerm) || x.NormalizedName.Contains(filterOptions.SearchTerm)) && x.Active).ToListAsync();
    }
}
