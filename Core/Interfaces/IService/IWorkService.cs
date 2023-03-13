using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IService
{
    public interface IWorkService
    {
        Task<IdentityResult> DeleteAsync(Guid id);
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<IdentityResult> SaveTagAsync(Tag tag);
        Task<IdentityResult> SaveColumnAsync(Column item);
        Task<T?> GetAsync<T>(Guid id);
        Task<IdentityResult> SaveContactFormAsync(ContactForm item);
        Task<IdentityResult> SaveRowAsync(Row row);
        Task<IdentityResult> BloggerSaveAsync(Blogger model);
        Task<IdentityResult> ColumnAddAsync(Column column);
        Task<IdentityResult> NavbarSettingSaveAsync(Navbar args);
        Task<IEnumerable<Option>> TagListAsync(WorkFilterOptions filterOptions);
        Task<IdentityResult> ItemAddAsync(WorkItem args);
        Task<WorkContent?> FindAsync(Guid id);
        Task<IEnumerable<Option>> GetListAsync(BasicFilterOptions filterOptions);
        Task<dynamic> ExportByCatalogAsync(Guid catalogId);
        Task<ListResult<WorkListItem>> GetWorkListItemChildAsync(WorkFilterOptions filterOptions);
        Task<IEnumerable<WorkContent>> GetWorkContentChildsAsync(Guid parentId);
        Task<IdentityResult> SaveAsync(WorkContent args);
        Task AddAsync(WorkContent workContent);
        Task AddItemAsync(WorkItem workItem);
        Task<IdentityResult> SaveArgumentsAsync(Guid id, object args);
        Task<WorkContent?> GetSummaryAsync(Guid id);
        Task<IdentityResult> UpdateSummaryAsync(WorkContent args);
    }
}
