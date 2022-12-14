using Microsoft.AspNetCore.Identity;
using Waffle.Entities;

namespace Waffle.Core.Interfaces.IServices
{
    public interface IFileExplorerService
    {
        Task<IdentityResult> DeleteFileItemAsync(FileItem item);
    }
}
