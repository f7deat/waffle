using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface IStreetService
{
    Task<TResult> CreateAsync(Street args);
    Task<ListResult> GetListAsync(StreetFilterOptions filterOptions);
    Task<object> GetOptionsAsync(StreetSelectOptions selectOptions);
}
