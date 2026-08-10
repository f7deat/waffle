using Microsoft.AspNetCore.Identity;
using System.Net;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services;

public class LocalizationService(ILocalizationRepository _localizationRepository) : ILocalizationService
{
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
        return key;
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
}
