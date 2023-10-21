using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
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

    public async Task<AppSetting?> FindAsync(Guid id) => await _settingRepository.FindAsync(id);

    public async Task<T?> GetAsync<T>(Guid id)
    {
        var setting = await _settingRepository.FindAsync(id);
        if (string.IsNullOrEmpty(setting?.Value)) return default;
        return JsonSerializer.Deserialize<T>(setting.Value);
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
                Description = "Data not found"
            });
        }
        data.Value = JsonSerializer.Serialize(args);
        await _context.SaveChangesAsync();
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> SaveFooterAsync(Footer args)
    {
        var setting = await _settingRepository.FindAsync(args.Id);
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
}
