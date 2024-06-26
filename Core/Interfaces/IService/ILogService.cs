﻿using Microsoft.AspNetCore.Identity;
using Waffle.Models;
using Waffle.Models.ViewModels.Logs;

namespace Waffle.Core.Interfaces.IService;

public interface ILogService
{
    Task AddAsync(string message, Guid catalogId);
    Task<IdentityResult> DeleteAllAsync();
    Task<IdentityResult> DeleteAsync(Guid id);
    Task<ListResult<AppLogListItem>> ListAsync(SearchFilterOptions filterOptions);
    Task MessageAsync(string text);
}
