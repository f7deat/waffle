using Waffle.Core.Interfaces;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Entities.Locations;
using Waffle.Models;

namespace Waffle.Core.IRepositories;

public interface IPlaceRepository : IAsyncRepository<Place>
{
    Task AddImagesAsync(List<PlaceImage> images);
    Task DeleteImageAsync(PlaceImage image);
    Task<PlaceImage?> GetImageById(Guid imageId);
    Task<IEnumerable<PlaceImage>> GetImagesAsync(Guid id);
    Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions);
    Task<ListResult> ListAsync(PlaceFilterOptions filterOptions);
}
