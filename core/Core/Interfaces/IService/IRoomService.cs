﻿using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args.Catalogs;
using Waffle.Models.List;
using Waffle.Models.Result;
using Waffle.Models.ViewModels;

namespace Waffle.Core.Interfaces.IService;

public interface IRoomService
{
    Task<DefResult> InitAsync(Guid catalogId);
    Task<DefResult> DeleteAsync(Guid catalogId);
    Task<DefResult> SaveAsync(RoomArgs args);
    Task<Room?> GetByCatalogAsync(Guid catalogId);
    Task<ListResult<RoomListItem>> GetRoomsAsync(BasicFilterOptions filterOptions);
    Task<IEnumerable<CatalogListItem>> GetCitiesAsync(Guid countryId);
}
