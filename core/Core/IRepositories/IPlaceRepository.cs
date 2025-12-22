using Waffle.Core.Interfaces;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IRepositories;

public interface IPlaceRepository : IAsyncRepository<Place>
{
    Task<IEnumerable<PlaceImage>> GetImagesAsync(Guid id);
    Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions);
    Task<ListResult> ListAsync(PlaceFilterOptions filterOptions);
}
