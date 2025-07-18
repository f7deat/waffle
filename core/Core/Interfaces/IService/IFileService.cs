﻿using Microsoft.AspNetCore.Identity;
using Waffle.Core.Services.Files.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Args;
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IFileService
{
    Task<int> CountAsync();
    Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions);
    Task<IdentityResult> UploadFromUrlAsync(string url);
    Task<FileContent?> FindAsync(Guid id);
    Task<decimal> GetTotalSizeAsync();
    Task<DefResult> UploadToHPUNIAsync(IFormFile file);
}
