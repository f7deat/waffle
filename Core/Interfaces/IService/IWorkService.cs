using Microsoft.AspNetCore.Identity;
using Waffle.Models.Components;

namespace Waffle.Core.Interfaces.IService
{
    public interface IWorkService
    {
        Task<IdentityResult> DeleteAsync(Guid id);
        Task<IdentityResult> ActiveAsync(Guid id);
        Task<IdentityResult> SaveTagAsync(Tag tag);
    }
}
