using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface ICountryRepository : IAsyncRepository<Country>
{
    Task<ListResult> GetListAsync(FilterOptions filterOptions);
}
