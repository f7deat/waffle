using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IProvinceRepository : IAsyncRepository<Province>
{
    Task<ListResult> GetListAsync(ProvinceFilterOptions filterOptions);
    Task<object> GetOptionsAsync(ProvinceSelectOptions selecOptions);
}
