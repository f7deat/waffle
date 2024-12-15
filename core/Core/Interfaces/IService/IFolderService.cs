using Waffle.Entities.Files;
using Waffle.Models.Filters.Folders;
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IFolderService
{
    Task<DefResult> AddAsync(Folder args);
    Task<DefResult> DeleteAsync(Guid id);
    Task<object?> ListAsync(FolderFilterOptions filterOptions);
    Task<DefResult> UpdateAsync(Folder args);
}
