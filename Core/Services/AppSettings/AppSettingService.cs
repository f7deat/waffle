using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;

namespace Waffle.Core.Services.AppSettings
{
    public class AppSettingService : IAppSettingService
    {
        private readonly ApplicationDbContext _context;
        public AppSettingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppSetting> EnsureSettingAsync(string name)
        {
            var appSetting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(name));
            if (appSetting is null)
            {
                appSetting = new AppSetting
                {
                    Name = name,
                    NormalizedName = name,
                    Value = string.Empty
                };
                await _context.AppSettings.AddAsync(appSetting);
                await _context.SaveChangesAsync();
            }
            return appSetting;
        }

        public async Task<ListResult<AppSetting>> ListAsync()
        {
            return new ListResult<AppSetting>
            {
                Data = await _context.AppSettings.Select(x => new AppSetting
                {
                    Name = x.Name,
                    Description = x.Description,
                    NormalizedName = x.NormalizedName,
                    Id = x.Id
                }).ToListAsync(),
                Total = await _context.AppSettings.CountAsync()
            };
        }

        public async Task<IdentityResult> SaveTelegramAsync(Telegram model)
        {
            var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(Telegram)));
            if (setting is null)
            {
                setting = new AppSetting
                {
                    Name = nameof(Telegram),
                    NormalizedName = nameof(Telegram),
                    Value = JsonSerializer.Serialize(model)
                };
                await _context.AppSettings.AddAsync(setting);
            }
            setting.Value = JsonSerializer.Serialize(model);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
