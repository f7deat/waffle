using Microsoft.AspNetCore.Identity;

namespace Waffle.Core.Interfaces.IServices
{
    public interface IWorkContentService
    {
        Task<IdentityResult> DeleteAsync(Guid id);
    }
}
