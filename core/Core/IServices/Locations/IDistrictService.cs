using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface IDistrictService
{
    Task<TResult> CreateAsync(District args);
    Task<TResult> GetByIdAsync(int id);
    Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions);
    Task<ListResult> ListAsync(DistrictFilterOptions filterOptions);
}
