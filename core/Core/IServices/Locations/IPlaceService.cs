
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface IPlaceService
{
    Task<TResult> GetByIdAsync(Guid id);
    Task<ListResult> ListAsync(PlaceFilterOptions filterOptions);
    Task<TResult> UpdateAsync(PlaceUpdateArgs args);
}
