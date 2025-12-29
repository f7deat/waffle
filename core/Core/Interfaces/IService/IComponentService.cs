using Microsoft.AspNetCore.Identity;
using Waffle.Core.Foundations.Models;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components.Common;
using Waffle.Models.Results.Components;

namespace Waffle.Core.Interfaces.IService;

public interface IComponentService
{
    Task<Component> EnsureComponentAsync(string normalizedName);
    Task<Component?> GetByNameAsync(string name);
    Task<Component?> FindAsync(Guid id);
    Task<ListResult<ComponentListResult>> ListAsync(ComponentFilterOptions filterOptions);
    Task<bool> HasWorkContentAsync(Guid id);
    Task<TResult> ActiveAsync(Guid id);
    Task<TResult> DeleteAsync(Guid id);
    Task<ListResult<WorkListItem>> ListWorkAsync(Guid id, WorkFilterOptions filterOptions);
    Task<IEnumerable<Component>> ListAllAsync();
    Task<TResult> UpdateAsync(Component args);
    Task<IEnumerable<Option>> FormSelectAsync(SearchFilterOptions filterOptions);
    Task<TResult> AddAsync(Component args);
}
