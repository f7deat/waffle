using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities.Users;
using Waffle.Models;

namespace Waffle.Modules.Users.Interfaces;

public interface IUserRepository : IAsyncRepository<ApplicationUser>
{
    Task<ListResult> GetRandomInfluencersAsync(FilterOptions filterOptions);
}
