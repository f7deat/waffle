using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class ProvinceRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Province>(context, hcaService), IProvinceRepository
{
    public async Task<ListResult> GetListAsync(ProvinceFilterOptions filterOptions)
    {
        var query = from p in _context.Provinces
                    select new
                    {
                        p.Id,
                        p.Name,
                        p.CountryId,
                        DistrictCount = _context.Districts.Count(d => d.ProvinceId == p.Id)
                    };
        if (!string.IsNullOrWhiteSpace(filterOptions.Name))
        {
            query = query.Where(p => p.Name.ToLower().Contains(filterOptions.Name.ToLower()));
        }
        return await ListResult.Success(query, filterOptions);
    }

    public async Task<object> GetOptionsAsync(ProvinceSelectOptions selecOptions)
    {
        var query = from p in _context.Provinces
                                        select new
                    {
                        p.Id,
                        p.Name,
                        p.CountryId
                    };
        if (selecOptions.CountryId.HasValue)
        {
            query = query.Where(p => p.CountryId == selecOptions.CountryId);
        }
        if (!string.IsNullOrWhiteSpace(selecOptions.KeyWords))
        {
            query = query.Where(p => p.Name.ToLower().Contains(selecOptions.KeyWords.ToLower()));
        }
        return await query.Select(p => new
        {
            Label = p.Name,
            Value = p.Id
        }).ToListAsync();
    }
}
