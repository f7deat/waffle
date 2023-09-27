using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IRepository;

public interface IOrderRepository : IAsyncRepository<Order>
{
    Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions);
    Task<IEnumerable<OrderDetail>> ListOrderDetails(Guid id);
    Task RemoveRange(IEnumerable<OrderDetail> orderDetails);
}
