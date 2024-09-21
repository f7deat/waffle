using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Options;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Infrastructure.Repositories;

public class LocalizationRepository : EfRepository<Localization>, ILocalizationRepository
{
    private readonly SettingOptions Options;
    public LocalizationRepository(ApplicationDbContext context, IOptions<SettingOptions> options) : base(context)
    {
        Options = options.Value;
    }

    public async Task<Localization?> FindAsync(string key, string lang) => await _context.Localizations.FirstOrDefaultAsync(x => x.Key.ToLower().Equals(key.ToLower()) && x.Language.Equals(lang));

    public async Task<List<string>> GetAllCacheAsync() => await _context.Localizations.Where(x => x.Language == Options.DefaultLanguage).Select(x => $"Localization-{x.Key}").AsNoTracking().ToListAsync();

    public IQueryable<Localization> GetListAsync(string lang, string? key)
    {
        var query = _context.Localizations.Where(x => x.Language == lang);
        if (!string.IsNullOrWhiteSpace(key))
        {
            query = query.Where(x => x.Key.ToLower().Contains(key.ToLower()));
        }
        return query.OrderBy(x => x.Key);
    }

    public async Task<bool> IsExistAsync(string lang, string key) => await _context.Localizations.AnyAsync(x => x.Language.Equals(lang) && x.Key.Equals(key));

}
