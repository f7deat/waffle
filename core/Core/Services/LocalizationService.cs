using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Net;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Options;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services;

public class LocalizationService : ILocalizationService
{
    private readonly ILocalizationRepository _localizationRepository;
    private readonly IMemoryCache _memoryCache;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SettingOptions Options;
    private readonly IRouteDataService _routeDataService;
    private readonly ApplicationDbContext _context;

    public LocalizationService(ApplicationDbContext context, IRouteDataService routeDataService, ILocalizationRepository localizationRepository, IMemoryCache memoryCache, IHttpContextAccessor httpContextAccessor, IOptions<SettingOptions> options)
    {
        _localizationRepository = localizationRepository;
        _memoryCache = memoryCache;
        _httpContextAccessor = httpContextAccessor;
        Options = options.Value;
        _routeDataService = routeDataService;
        _context = context;
    }

    public string CurrentLocale()
    {
        var cookies = _httpContextAccessor.HttpContext?.Request.Cookies;

        if (cookies != null && cookies.ContainsKey(CookieKey.Locale))
        {
            return cookies[CookieKey.Locale] ?? "vi-VN";
        }
        return "vi-VN";
    }

    public async Task<IdentityResult> AddAsync(Localization args)
    {
        if (await _localizationRepository.IsExistAsync(args.Language, args.Key))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = HttpStatusCode.Ambiguous.ToString(),
                Description = "Key existed!"
            });
        }
        await _localizationRepository.AddAsync(args);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(Guid id)
    {
        var localization = await GetAsync(id);
        if (localization is null)
        {
            return IdentityResult.Failed();
        }
        await _localizationRepository.DeleteAsync(localization);
        return IdentityResult.Success;
    }

    public Task<List<string>> GetAllCacheAsync() => _localizationRepository.GetAllCacheAsync();

    public async Task<string> GetAsync(string key)
    {
        var cacheKey = $"{nameof(Localization)}-{key}";
        if (!_memoryCache.TryGetValue($"{cacheKey}", out string? cacheValue))
        {
            var locale = _routeDataService.GetLocale();
            var i18n = await _localizationRepository.FindAsync(key, locale);
            if (i18n is null)
            {
                i18n = new Localization
                {
                    Key = key,
                    Language = locale,
                };
                await _localizationRepository.AddAsync(i18n);
            }
            cacheValue = i18n.Value ?? key;
            var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromDays(1));
            _memoryCache.Set(cacheKey, cacheValue, cacheEntryOptions);
        }
        return cacheValue ?? key;
    }

    public async Task<Localization?> GetAsync(Guid id) => await _localizationRepository.FindAsync(id);

    public async Task<ListResult<Localization>> GetListAsync(LocalizationFilterOptions filterOptions)
    {
        var lang = filterOptions.Locale;
        var query = _localizationRepository.GetListAsync(lang, filterOptions.Key);
        if (filterOptions.IsTranslated is not null)
        {
            if (filterOptions.IsTranslated == true)
            {
                query = query.Where(x => !string.IsNullOrEmpty(x.Value));
            }
            else
            {
                query = query.Where(x => string.IsNullOrEmpty(x.Value));
            }
        }
        return await ListResult<Localization>.Success(query, filterOptions);
    }

    public async Task<IdentityResult> SaveAsync(Localization args)
    {
        var localization = await GetAsync(args.Id);
        if (localization is null)
        {
            return IdentityResult.Failed();
        }
        localization.Value = args.Value;
        await _localizationRepository.SaveChangesAsync();
        return IdentityResult.Success;
    }

    private async Task TranslateAsync(Dictionary<string, Dictionary<string, string>> keys)
    {
        var translations = await _context.Localizations.Where(x => string.IsNullOrEmpty(x.Value)).ToListAsync();
        foreach (var key in keys)
        {
            var translationKeys = translations.Where(x => x.Key == key.Key).ToList();
            foreach (var item in key.Value)
            {
                var translation = translationKeys.FirstOrDefault(x => x.Language == item.Key);
                if (translation is null) continue;
                translation.Value = item.Value;
                _context.Localizations.Update(translation);
            }
        }
        await _context.SaveChangesAsync();
    }

    public async Task InitialAsync()
    {
        var keys = new Dictionary<string, Dictionary<string, string>>();
        // Add your keys here
        keys.Add("login", new Dictionary<string, string>
        {
            { "en-US", "Login" },
            { "vi-VN", "Đăng nhập" },
            { "ko-KR", "로그인" },
            { "ja-JP", "ログイン" },
            { "zh-CN", "登录" },
        });
        keys.Add("register", new Dictionary<string, string>
        {
            { "en-US", "Register" },
            { "vi-VN", "Đăng ký" },
            { "ko-KR", "레지스터" },
            { "ja-JP", "登録" },
            { "zh-CN", "寄存器" },
        });
        keys.Add("home", new Dictionary<string, string>
        {
            { "en-US", "Home" },
            { "vi-VN", "Trang chủ" },
            { "ko-KR", "집" },
            { "ja-JP", "ホーム" },
            { "zh-CN", "家" },
        });
        await TranslateAsync(keys);

    }
}
