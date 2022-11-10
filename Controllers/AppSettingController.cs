using Microsoft.AspNetCore.Identity;
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

        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeAsync()
        {
            var sendGrid = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName == nameof(SendGrid));
            if (sendGrid is null)
            {
                sendGrid = new AppSetting
                {
                    NormalizedName = nameof(SendGrid),
                    Name = nameof(SendGrid)
                };
                await _context.AppSettings.AddAsync(sendGrid);
            }

            var contactForm = await _context.Components.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(ContactForm)));
            if (contactForm is null)
            {
                contactForm = new Component
                {
                    Name = nameof(ContactForm),
                    NormalizedName = nameof(ContactForm),
                    Active = true
                };
                await _context.Components.AddAsync(contactForm);
            }

            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
