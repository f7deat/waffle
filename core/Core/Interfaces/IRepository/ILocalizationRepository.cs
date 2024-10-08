﻿using Waffle.Entities;

namespace Waffle.Core.Interfaces.IRepository;

public interface ILocalizationRepository : IAsyncRepository<Localization>
{
    Task<Localization?> FindAsync(string key, string lang);
    Task<List<string>> GetAllCacheAsync();
    IQueryable<Localization> GetListAsync(string lang, string? key);
    Task<bool> IsExistAsync(string lang, string key);
}
