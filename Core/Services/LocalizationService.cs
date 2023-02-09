using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class LocalizationService : ILocalizationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILocalizationRepository _localizationRepository;
        private readonly IMemoryCache _memoryCache;

        public LocalizationService(ApplicationDbContext context, IConfiguration configuration, ILocalizationRepository localizationRepository, IMemoryCache memoryCache)
        {
            _context = context;
            _configuration = configuration;
            _localizationRepository = localizationRepository;
            _memoryCache = memoryCache;
        }

        public async Task<IdentityResult> AddAsync(Localization args)
        {
            var lang = _configuration.GetValue<string>("language");
            if (await _context.Localizations.AnyAsync(x => x.Language.Equals(lang) && x.Key.Equals(args.Key)))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Key existed!"
                });
            }
            if (string.IsNullOrWhiteSpace(args.Key) || string.IsNullOrWhiteSpace(args.Value))
            {
                return IdentityResult.Failed();
            }
            args.Language = lang;
            args.Key = args.Key.Trim();
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

        public async Task<string> GetAsync(string key)
        {
            var cacheKey = $"{nameof(Localization)}-{key}";
            if (!_memoryCache.TryGetValue($"{key}", out string cacheValue))
            {
                var lang = _configuration.GetValue<string>("language");
                var i18n = await _context.Localizations.FirstOrDefaultAsync(x => x.Key.ToLower().Equals(key.ToLower()) && x.Language.Equals(lang));
                if (i18n is null)
                {
                    i18n = new Localization
                    {
                        Key = key,
                        Language = lang,
                    };
                    await _localizationRepository.AddAsync(i18n);
                }
                cacheValue = i18n.Value ?? key;
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(1));
                _memoryCache.Set(cacheKey, cacheValue, cacheEntryOptions);
            }
            return cacheValue;
        }

        public async Task<Localization?> GetAsync(Guid id) => await _localizationRepository.FindAsync(id);

        public async Task<ListResult<Localization>> GetListAsync(BasicFilterOptions filterOptions)
        {
            var lang = _configuration.GetValue<string>("language");
            var query = _context.Localizations.Where(x => x.Language.Equals(lang)).OrderBy(x => x.Key);
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
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }
    }
}
