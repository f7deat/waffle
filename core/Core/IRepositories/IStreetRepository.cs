using Waffle.Core.Interfaces;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IRepositories;

public interface IStreetRepository : IAsyncRepository<Street>
{
    Task<ListResult> GetListAsync(StreetFilterOptions filterOptions);
    Task<object> GetOptionsAsync(StreetSelectOptions selectOptions);
    Task<bool> IsExistAsync(int districtId, string name);
}
