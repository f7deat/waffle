using Waffle.Core.Foundations.Interfaces;
using Waffle.Core.Services.Files.Results;
using Waffle.Entities.Files;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IFileRepository : IAsyncRepository<FileContent>
{
    Task<decimal> GetTotalSizeAsync();
    Task<ListResult<FileAndFolderListItem>> ListAsync(FileFilterOptions filterOptions);
}
