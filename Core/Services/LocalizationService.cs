using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public LocalizationService(ApplicationDbContext context, IConfiguration configuration, ILocalizationRepository localizationRepository)
        {
            _context = context;
            _configuration = configuration;
            _localizationRepository = localizationRepository;
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
            args.Key = args.Key.Trim().ToLower();
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
            var lang = _configuration.GetValue<string>("language");
            var i18n = await _context.Localizations.FirstOrDefaultAsync(x => x.Key.Equals(key.ToLower()) && x.Language.Equals(lang));
            if (i18n is null)
            {
                i18n = new Localization
                {
                    Key = key,
                    Language = lang,
                };
                await _localizationRepository.AddAsync(i18n);
            }
            return i18n.Value ?? key;
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
