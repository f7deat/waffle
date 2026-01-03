using Waffle.Core.Foundations.Models;
using Waffle.Entities;

namespace Waffle.Core.Interfaces.IService;

public interface IContactService
{
    Task<TResult> AddAsync(Contact args);
    Task<TResult> DeleteAsync(Guid id);
}
