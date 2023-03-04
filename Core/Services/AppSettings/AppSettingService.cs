using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

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

        public async Task<T?> GetAsync<T>(Guid id)
        {
            var setting = await _context.AppSettings.FindAsync(id);
            if (string.IsNullOrEmpty(setting?.Value))
            {
                return default;
            }
            return JsonSerializer.Deserialize<T>(setting.Value);
        }

        public async Task<T?> GetAsync<T>(string normalizedName)
        {
            if (string.IsNullOrEmpty(normalizedName))
            {
                throw new ArgumentNullException(nameof(normalizedName));
            }
            var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(normalizedName));
            if (setting is null)
            {
                setting = new AppSetting { Name = normalizedName, NormalizedName = normalizedName };
                await _context.AppSettings.AddAsync(setting);
                await _context.SaveChangesAsync();
            }
            if (string.IsNullOrEmpty(setting.Value))
            {
                return default;
            }
            return JsonSerializer.Deserialize<T>(setting.Value);
        }

        public async Task<IdentityResult> HeaderLogoAsync(Header args)
        {
            var setting = await _context.AppSettings.FindAsync(args.Id);
            if (setting is null)
            {
                return IdentityResult.Failed();
            }
            if (string.IsNullOrEmpty(setting.Value))
            {
                setting.Value = JsonSerializer.Serialize(args);
            }
            else
            {
                var header = JsonSerializer.Deserialize<Header>(setting.Value);
                if (header != null)
                {
                    header.Logo = args.Logo;
                    setting.Value = JsonSerializer.Serialize(header);
                }
            }
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> HeaderSaveAsync(Header args)
        {
            var setting = await _context.AppSettings.FindAsync(args.Id);
            if (setting is null)
            {
                return IdentityResult.Failed();
            }
            setting.Value = JsonSerializer.Serialize(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<ListResult<AppSetting>> ListAsync()
        {
            return await ListResult<AppSetting>.Success(_context.AppSettings.Select(x => new AppSetting
            {
                Name = x.Name,
                Description = x.Description,
                NormalizedName = x.NormalizedName,
                Id = x.Id
            }), new BasicFilterOptions
            {
                Current = 1,
                PageSize = 10
            });
        }

        public async Task<IdentityResult> SaveFooterAsync(Footer args)
        {
            var setting = await _context.AppSettings.FindAsync(args.Id);
            if (setting is null)
            {
                return IdentityResult.Failed();
            }
            setting.Value = JsonSerializer.Serialize(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
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
