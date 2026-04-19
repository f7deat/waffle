using Waffle.Core.Foundations.Models;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface ICountryService
{
    Task<TResult> CreateAsync(Country args);
    Task<TResult> UpdateAsync(Country args);
    Task<TResult> DeleteAsync(int id);
    Task<TResult> GetByIdAsync(int id);
    Task<ListResult> GetListAsync(FilterOptions filterOptions);
}
