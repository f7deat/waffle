using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.List;

namespace Waffle.Pages.Room;

public class IndexModel(IRoomService _roomService, ICatalogService catalogService) : EntryPageModel(catalogService)
{
    public ListResult<RoomListItem>? Rooms;
    [BindProperty(SupportsGet = true)]
    public BasicFilterOptions FilterOptions { get; set; } = new() { Current = 1, PageSize = 21 };

    public async Task OnGetAsync()
    {
        Rooms = await _roomService.GetRoomsAsync(FilterOptions);
    }
}
