using Waffle.Core.Foundations.Interfaces;
using Waffle.Entities;

namespace Waffle.Core.Interfaces.IRepository;

public interface IContactRepository : IAsyncRepository<Contact>
{
    Task<bool> IsExistAsync(string? phoneNumber, string? email);
}
