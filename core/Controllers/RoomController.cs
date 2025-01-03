using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Foundations;

namespace Waffle.Controllers;

public class RoomController(ApplicationDbContext _context) : BaseController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Rooms.FindAsync(id));
}
