using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IDistrictRepository : IAsyncRepository<District>
{
    Task<object> GetOptionsAsync(DistrictSelectOptions filterOptions);
    Task<ListResult> ListAsync(DistrictFilterOptions filterOptions);
}
