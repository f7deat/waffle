﻿using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IService;

public interface IAppSettingService
{
    Task<AppSetting> EnsureSettingAsync(string name);
    Task<AppSetting?> FindAsync(Guid catalogId);
    Task<T?> GetAsync<T>(Guid id);
    Task<T?> GetAsync<T>(string normalizedName);
    Task<ListResult<AppSetting>> ListAsync();
    Task<IdentityResult> SaveAsync(Guid id, object args);
    Task<IdentityResult> SaveFooterAsync(Footer args);
    Task<IdentityResult> SaveTelegramAsync(Guid id, Telegram model);
}
