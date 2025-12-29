using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.List;
using Waffle.Models.Result;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IService;

public interface IRoomService
{
    Task<TResult> InitAsync(Guid catalogId);
    Task<TResult> DeleteAsync(Guid catalogId);
    Task<TResult> SaveAsync(RoomArgs args);
    Task<Room?> GetByCatalogAsync(Guid catalogId);
    Task<ListResult<RoomListItem>> GetRoomsAsync(BasicFilterOptions filterOptions);
    Task<IEnumerable<CatalogListItem>> GetCitiesAsync(Guid countryId);
}
