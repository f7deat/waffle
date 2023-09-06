using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.Controllers;

public class MigrationController : BaseController
{
    private readonly ApplicationDbContext _context;
    public MigrationController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> StartAsync()
    {
        var block = from a in _context.Components
                    join b in _context.WorkContents on a.Id equals b.ComponentId
                    where a.NormalizedName == "Block"
                    select b;
        var editor = await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName == nameof(Editor));
        if (editor is null) return Ok(IdentityResult.Failed(new IdentityError
        {
            Description = "Editor component not found!"
        }));
        foreach (var item in block)
        {
            item.ComponentId = editor.Id;
        }
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }
}
