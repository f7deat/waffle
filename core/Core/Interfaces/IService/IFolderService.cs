using Waffle.Entities.Files;
using Waffle.Models.Result;

namespace Waffle.Core.Interfaces.IService;

public interface IFolderService
{
    Task<DefResult> AddAsync(Folder args);
}
