﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.SendGrid;
using Waffle.Models.Components;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class AppSettingController : Controller
    {
        private readonly ApplicationDbContext _context;
        public AppSettingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(new
            {
                data = await _context.AppSettings.Select(x => new AppSetting
                {
                    Name = x.Name,
                    Description = x.Description,
                    NormalizedName = x.NormalizedName,
                    Id = x.Id
                }).ToListAsync(),
                total = await _context.AppSettings.CountAsync()
            });
        }

        [HttpGet("layout/{id}")]
        public async Task<IActionResult> GetLayoutAsync([FromRoute] Guid id)
        {
            var setting = await _context.AppSettings.FindAsync(id);
            if (setting is null)
            {
                return Ok(IdentityResult.Failed());
            }
            var query = from a in _context.WorkItems
                               join b in _context.WorkContents on a.CatalogId equals setting.Id
                               where a.CatalogId == setting.Id
                               orderby a.SortOrder ascending
                               select b;
            return Ok(new
            {
                data = await query.ToListAsync(),
                total = await query.CountAsync()
            });
        }
    }
}
