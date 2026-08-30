using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using Waffle.Core.Constants;
using Waffle.Core.Foundations.Models;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Settings.Args;
using Waffle.Data;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Telegrams.Models;
using Waffle.Models;
using Waffle.Models.Settings;

namespace Waffle.Core.Services;

public class SettingService(ApplicationDbContext _context, ILogService _logService, IMemoryCache _memoryCache, ISettingRepository _settingRepository) : ISettingService
{
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

    public async Task<T?> GetAsync<T>(string normalizedName, string locale = "vi-VN")
    {
        var setting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.ToUpper().Equals(normalizedName.ToUpper()));
        if (setting is null) return default;
        if (string.IsNullOrEmpty(setting.Value)) return default;
        return JsonSerializer.Deserialize<T>(setting.Value);
    }

    private void RemoveCache(string normalizedName)
    {
        if (string.IsNullOrEmpty(normalizedName)) return;
        var cacheKey = $"{nameof(AppSetting)}-{normalizedName}";
        _memoryCache.Remove(cacheKey);
    }

    public async Task<ListResult<AppSetting>> ListAsync(SearchFilterOptions filterOptions)
    {
        var query = from a in _context.AppSettings
                    where a.Locale == filterOptions.Locale
                    select a;
        if (!string.IsNullOrWhiteSpace(filterOptions.SearchTerm))
        {
            query = query.Where(x => x.Name.Contains(filterOptions.SearchTerm, StringComparison.CurrentCultureIgnoreCase));
        }
        query = query.OrderBy(x => x.NormalizedName);
        return await ListResult<AppSetting>.Success(query, filterOptions);
    }

    public async Task<TResult> SaveAsync(SettingUpdateArgs args)
    {
        var data = await _settingRepository.FindByNameAsync(args.Name);
        if (data is null) return TResult.Failed("Data not found");
        data.Value = JsonSerializer.Serialize(args.Value);
        await _context.SaveChangesAsync();
        RemoveCache(data.NormalizedName);
        return TResult.Success;
    }

    public async Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram args)
    {
        var setting = await _settingRepository.FindAsync(id);
        if (setting is null)
        {
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

    private async Task<bool> IsExistAsync(string normalizedName)
    {
        var setting = await _settingRepository.FindByNameAsync(normalizedName);
        return setting is not null;
    }

    public async Task<TResult> InitAsync()
    {
        if (!await IsExistAsync(SettingName.TELEGRAM))
        {
            await _context.AppSettings.AddAsync(new AppSetting
            {
                NormalizedName = SettingName.TELEGRAM,
                Name = "Telegram",
                Value = JsonSerializer.Serialize(new TelegramSetting
                {
                    Token = string.Empty,
                    ChatId = string.Empty
                }),
                Locale = "vi-VN"
            });
        }
        if (!await IsExistAsync(SettingName.HEADER))
        {
            await _context.AppSettings.AddAsync(new AppSetting
            {
                NormalizedName = SettingName.HEADER,
                Name = "Header",
                Value = JsonSerializer.Serialize(new Header()),
                Locale = "vi-VN"
            });
        }
        if (!await IsExistAsync(SettingName.FOOTER))
        {
            await _context.AppSettings.AddAsync(new AppSetting
            {
                NormalizedName = SettingName.FOOTER,
                Name = "Footer",
                Value = JsonSerializer.Serialize(new Footer()),
                Locale = "vi-VN"
            });
        }
        await _context.SaveChangesAsync();
        return TResult.Success;
    }

    public async Task<TResult> DeleteAsync(Guid id)
    {
        var setting = await _settingRepository.FindAsync(id);
        if (setting is null) return TResult.Failed("Data not found");
        await _logService.AddAsync($"Delete setting {setting.Name} ({setting.Id})");
        await _settingRepository.DeleteAsync(setting);
        return TResult.Success;
    }
}
