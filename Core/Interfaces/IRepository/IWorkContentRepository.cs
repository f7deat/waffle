using Waffle.Entities;

namespace Waffle.Core.Interfaces.IRepository;

public interface IWorkContentRepository : IAsyncRepository<WorkContent>
{
    Task<WorkContent?> FindByCatalogAsync(Guid catalogId, Guid componentId);
    Task<IEnumerable<WorkContent>> ListChildAsync(Guid parentId);
}
