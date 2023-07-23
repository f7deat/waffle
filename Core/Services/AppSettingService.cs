using Microsoft.AspNetCore.Hosting.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Waffle.Core.Constants;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Extensions;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;
using Waffle.Models.Settings;

namespace Waffle.Core.Services
{
    public class AppSettingService : IAppSettingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AppSettingService> _logger;
        private readonly ILookupNormalizer _lookupNormalizer;
        public AppSettingService(ApplicationDbContext context, ILogger<AppSettingService> logger, ILookupNormalizer lookupNormalizer)
        {
            _context = context;
            _logger = logger;
            _lookupNormalizer = lookupNormalizer;
        }

        public async Task<IdentityResult> AddWorkAsync(WorkContent args)
        {
            var setting = await _context.AppSettings.FindAsync(args.ParentId);
            if (setting is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "App setting not found"
                });
            }
            await _context.WorkContents.AddAsync(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteWorkAsync(Guid id)
        {
            var work = await _context.WorkContents.FindAsync(id);
            if (work is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Work not found!"
                });
            }
            _context.WorkContents.Remove(work);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
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

        public async Task<AppSetting?> FindAsync(Guid id) => await _context.AppSettings.FindAsync(id);

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
            if (string.IsNullOrEmpty(normalizedName)) throw new ArgumentNullException(nameof(normalizedName));

            var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(normalizedName));
            if (setting is null)
            {
                setting = new AppSetting { Name = normalizedName, NormalizedName = normalizedName };
                await _context.AppSettings.AddAsync(setting);
                await _context.SaveChangesAsync();
            }
            if (string.IsNullOrEmpty(setting.Value)) return default;

            return JsonSerializer.Deserialize<T>(setting.Value);
        }

        public async Task<object?> GetByNameAsync(string normalizedName)
        {
            if (!SupportSetting.Values.Any(x => x.Equals(normalizedName, StringComparison.OrdinalIgnoreCase))) return default;

            var name = _lookupNormalizer.NormalizeName(normalizedName);

            var data = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName == name);
            if (data is null)
            {
                
            };
            return data;
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

        public async Task<IdentityResult> SaveAsync(Guid id, object args)
        {
            var data = await _context.AppSettings.FindAsync(id);
            if (data is null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found"
                });
            }
            data.Value = JsonSerializer.Serialize(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
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

        public async Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram args)
        {
            var setting = await _context.AppSettings.FindAsync(id);
            if (setting is null)
            {
                _logger.LogError("Data not found");
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Data not found"
                });
            }
            setting.Value = JsonSerializer.Serialize(args);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
