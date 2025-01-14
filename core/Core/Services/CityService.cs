using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services;

public class CityService(ApplicationDbContext _context) : ICityService
{
    public async Task<ListResult<Catalog>> GetListAsync(BasicFilterOptions filterOptions)
    {
        var query = from a in _context.Catalogs
                    where a.Type == CatalogType.City && a.Locale == filterOptions.Locale
                    select a;
        return await ListResult<Catalog>.Success(query, filterOptions);
    }
}
