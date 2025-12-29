using Waffle.Core.Foundations;
using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories.Locations;

public class CountryRepository(ApplicationDbContext context, IHCAService hcaService) : EfRepository<Country>(context, hcaService), ICountryRepository
{
    public async Task<ListResult> GetListAsync(FilterOptions filterOptions)
    {
        var query = from c in _context.Countries
                    select new
                    {
                        c.Id,
                        c.Name,
                        ProvinceCount = _context.Provinces.Count(p => p.CountryId == c.Id)
                    };
        query = query.OrderByDescending(c => c.Id);
        return await ListResult.Success(query, filterOptions);
    }
}
