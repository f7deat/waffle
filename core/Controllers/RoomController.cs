using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Foundations;
using Waffle.Models.Args.Catalogs;

namespace Waffle.Controllers;

public class RoomController(ApplicationDbContext _context, IRoomService _roomService) : BaseController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Rooms.FirstOrDefaultAsync(x => x.CatalogId == id));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _roomService.DeleteAsync(id));

    [HttpPost("save")]
    public async Task<IActionResult> SaveAsync([FromBody] RoomArgs args)
    {
        var result = await _roomService.SaveAsync(args);
        if (!result.Succeeded) return BadRequest(result.Message);
        return Ok(result);
    }
}
