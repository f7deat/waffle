using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Settings;

namespace Waffle.Core.Services;

public class SettingService : ISettingService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SettingService> _logger;
    private readonly ILookupNormalizer _lookupNormalizer;
    private readonly IMemoryCache _memoryCache;
    private readonly ISettingRepository _settingRepository;

    public SettingService(ApplicationDbContext context, ILogger<SettingService> logger, ILookupNormalizer lookupNormalizer, IMemoryCache memoryCache, ISettingRepository settingRepository)
    {
        _context = context;
        _logger = logger;
        _lookupNormalizer = lookupNormalizer;
        _memoryCache = memoryCache;
        _settingRepository = settingRepository;
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

    public async Task<object> GetAsync(Guid id)
    {
        try
        {
            var data = new SettingModel<object>();
            var setting = await _settingRepository.FindAsync(id);
            if (string.IsNullOrEmpty(setting?.Value)) return new { data };
            data.Data = JsonSerializer.Deserialize<object>(setting.Value);
            data.Name = setting.Name;
            data.NormalizedName = setting.NormalizedName;
            return new { data };
        }
        catch (Exception ex)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = nameof(Exception),
                Description = ex.ToString()
            });
        }
    }

    public async Task<T?> GetAsync<T>(string normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) throw new ArgumentNullException(nameof(normalizedName));

        var cacheKey = $"{nameof(AppSetting)}-{normalizedName}";

        if (!_memoryCache.TryGetValue($"{cacheKey}", out T? cacheValue))
        {
            var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.ToLower().Equals(normalizedName));
            if (setting is null)
            {
                setting = new AppSetting { Name = normalizedName, NormalizedName = normalizedName };
                await _settingRepository.AddAsync(setting);
            }
            if (string.IsNullOrEmpty(setting.Value)) return default;

            cacheValue = JsonSerializer.Deserialize<T>(setting.Value);

            var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromDays(1));
            _memoryCache.Set(cacheKey, cacheValue, cacheEntryOptions);
        }

        return cacheValue;
    }

    private void RemoveCache(string normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) return;
        var cacheKey = $"{nameof(AppSetting)}-{normalizedName}";
        _memoryCache.Remove(cacheKey);
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
        var data = await _settingRepository.FindAsync(id);
        if (data is null)
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "dataNotFound",
                Description = "Data not found"
            });
        }
        data.Value = JsonSerializer.Serialize(args);
        await _context.SaveChangesAsync();
        RemoveCache(data.NormalizedName);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram args)
    {
        var setting = await _settingRepository.FindAsync(id);
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

    public async Task<IdentityResult> SaveAsync(string normalizedName, object args)
    {
        var setting = await _settingRepository.FindByNameAsync(normalizedName);
        if (setting is null) return IdentityResult.Failed(new IdentityError
        {
            Code = "dataNotFound",
            Description = "Data not found!"
        });
        setting.Value = JsonSerializer.Serialize(args);
        await _settingRepository.UpdateAsync(setting);
        RemoveCache(setting.NormalizedName);
        return IdentityResult.Success;
    }
}
