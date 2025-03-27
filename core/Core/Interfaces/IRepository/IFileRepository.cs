using Waffle.Core.Services.Files.Models;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IFileRepository : IAsyncRepository<FileContent>
{
    Task<decimal> GetTotalSizeAsync();
    Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions);
}
