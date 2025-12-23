
using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Locations.Args;
using Waffle.Core.Services.Locations.Filters;
using Waffle.Models;

namespace Waffle.Core.IServices.Locations;

public interface IPlaceService
{
    Task<TResult> AddImageAsync(PlaceAddImageArgs args, string host);
    Task<TResult> DeleteImageAsync(Guid imageId, string host);
    Task<TResult> GetByIdAsync(Guid id);
    Task<TResult> GetByNormalizedNameAsync(string normalizedName);
    Task<TResult> GetImagesAsync(Guid placeId);
    Task<ListResult> GetRandomAsync(PlaceFilterOptions filterOptions);
    Task<ListResult> ListAsync(PlaceFilterOptions filterOptions);
    Task<TResult> UpdateAsync(PlaceUpdateArgs args);
}
