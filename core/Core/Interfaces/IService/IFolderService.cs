using Waffle.Core.Foundations.Models;
using Waffle.Core.Services.Files.Filters;
using Waffle.Core.Services.Files.Results;
using Waffle.Entities.Files;

namespace Waffle.Core.Interfaces.IService;

public interface IFolderService
{
    Task<TResult> AddAsync(Folder args, string locale);
    Task<TResult> DeleteAsync(Guid id);
    Task<object?> ListAsync(FolderFilterOptions filterOptions);
    Task<IReadOnlyList<FolderTreeItem>> TreeAsync(string locale, CancellationToken cancellationToken);
    Task<TResult> UpdateAsync(Folder args);
}
