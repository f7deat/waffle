using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models.Filters;
using Waffle.Models.Result;

namespace Waffle.Controllers;

public class MenuController(ApplicationDbContext _context) : BaseController
{
    [HttpGet("parent-options")]
    public async Task<IActionResult> GetParentOptionsAsync([FromQuery] string locale) => Ok(await _context.Menus.Where(x => x.ParentId == null && x.Active && x.Locale == locale).Select(x => new
    {
        label = x.Name,
        value = x.Id
    }).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Menus.FindAsync(id));

    [HttpGet("list")]
    public async Task<IActionResult> GetListAsync([FromQuery] MenuFilterOptions filterOptions)
    {
        try
        {
            var query = from a in _context.Menus
                        where a.Locale == filterOptions.Locale
                        select a;
            query = query.OrderBy(x => x.SortOrder);
            var menus = await query.ToListAsync();

            var parents = menus.Where(x => x.ParentId == null);
            var results = new List<NavItem>();

            foreach (var parent in parents)
            {
                var navItem = new NavItem
                {
                    Name = parent.Name,
                    Id = parent.Id,
                    Url = parent.Url,
                    SortOrder = parent.SortOrder,
                    Active = parent.Active,
                    Icon = parent.Icon
                };
                if (menus.Any(x => x.ParentId == parent.Id))
                {
                    navItem.Children = menus.Where(x => x.ParentId == parent.Id).Select(x => new NavItem
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Url = x.Url,
                        SortOrder = x.SortOrder,
                        Active = x.Active,
                        Icon = x.Icon
                    });
                }
                results.Add(navItem);
            }

            return Ok(new
            {
                data = results,
                total = results.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Menu args, [FromQuery] string locale)
    {
        if (args.ParentId != null && !await _context.Menus.AnyAsync(x => x.Id == args.ParentId)) return BadRequest("Parent menu not found!");
        if (!LocaleHelper.IsAvailable(locale)) return BadRequest("Language not available!");
        args.Locale = locale;
        await _context.Menus.AddAsync(args);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateAsync([FromBody] Menu args, [FromQuery] string locale)
    {
        var data = await _context.Menus.FindAsync(args.Id);
        if (data is null) return NoContent();
        if (!LocaleHelper.IsAvailable(locale)) return BadRequest("Language not available!");
        data.Url = args.Url;
        data.Active = args.Active;
        data.Name = args.Name;
        data.SortOrder = args.SortOrder;
        data.Icon = args.Icon;
        _context.Menus.Update(data);
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var data = await _context.Menus.FindAsync(id);
        if (data is null) return NoContent();
        _context.Menus.Remove(data);
        if (await _context.Menus.AnyAsync(x => x.ParentId == id)) return BadRequest("Please remove child menu!");
        await _context.SaveChangesAsync();
        return Ok(IdentityResult.Success);
    }
}
