using Microsoft.AspNetCore.Identity;
using Waffle.Entities;
using Waffle.ExternalAPI.Google.Models;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IService
{
    public interface IWorkService
    {
        Task<IdentityResult> DeleteAsync(Guid id);
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<IdentityResult> SaveTagAsync(Tag tag);
        Task<Column?> GetColumnAsync(Guid id);
        Task<IdentityResult> SaveColumnAsync(Column item);
        T? Get<T>(string content);
        Task<IdentityResult> SaveContactFormAsync(ContactForm item);
        Task<IdentityResult> SaveRowAsync(Row row);
        Task<Row?> GetRowAsync(Guid id);
        Task<IdentityResult> BloggerSaveAsync(Blogger model);
        Task<Blogger?> BloggerGetAsync(Guid id);
        Task<List<BlockEditorBlock>?> BlogEditorGetAsync(Guid id);
        Task<WorkContent?> GetAsync(Guid id);
    }
}
