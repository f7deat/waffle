using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;

namespace Waffle.Core.Interfaces.IRepository;

public interface IDistrictRepository : IAsyncRepository<District>
{
    Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions);
}
