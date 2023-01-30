using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService
{
    public interface IFileExplorerService
    {
        Task RemoveFromItemAsync(Guid itemId);
        Task<IdentityResult> DeleteFileItemAsync(FileItem item);
        Task<ListResult<FileContent>> ListAsync(FileFilterOptions filterOptions);
        Task<IdentityResult> UploadFromUrlAsync(string url);
    }
}
