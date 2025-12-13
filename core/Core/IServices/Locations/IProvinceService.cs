using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface IProvinceService
{
    Task<TResult> CreateAsync(Province args);
    Task<ListResult> GetListAsync(ProvinceFilterOptions filterOptions);
    Task<object> GetOptionsAsync(ProvinceSelectOptions selecOptions);
}
