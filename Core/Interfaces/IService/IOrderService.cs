using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService
{
    public interface IOrderService
    {
        Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions);
    }
}
