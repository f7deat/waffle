using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Results.Components;

namespace Waffle.Infrastructure.Repositories;

public class ComponentRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Component>(context, hcaService), IComponentRepository
{
    public async Task<Component?> FindByNameAsync(string normalizedName)
    {
        return await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.Equals(normalizedName) && x.Active);
    }

    public async Task<List<Component>> ListAsync(SearchFilterOptions filterOptions)
    {
        return await _context.Components.Where(x => (string.IsNullOrEmpty(filterOptions.SearchTerm) || x.NormalizedName.Contains(filterOptions.SearchTerm)) && x.Active).ToListAsync();
    }

    public async Task<ListResult<ComponentListResult>> ListAsync(ComponentFilterOptions filterOptions)
    {
        var query = _context.Components.Where(x => string.IsNullOrEmpty(filterOptions.Name) || x.Name.ToLower().Contains(filterOptions.Name.ToLower()))
            .Select(x => new ComponentListResult
            {
                Id = x.Id,
                Name = x.Name,
                NormalizedName = x.NormalizedName,
                Active = x.Active,
                Count = _context.WorkContents.Count(w => w.ComponentId == x.Id)
            });
        if (filterOptions.Active != null)
        {
            query = query.Where(x => x.Active == filterOptions.Active);
        }
        query = query.OrderBy(x => x.NormalizedName);
        return await ListResult<ComponentListResult>.Success(query, filterOptions);
    }
}
