using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IServices
{
    public interface IFileExplorerService
    {
        Task<IdentityResult> DeleteFileItemAsync(FileItem item);
        Task<dynamic> ListAsync(FileFilterOptions filterOptions);
    }
}
