using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface ICityService
{
    Task<ListResult<Catalog>> GetListAsync(BasicFilterOptions filterOptions);
}
