using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Data;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Infrastructure.Repositories;

public class OrderRepository(ApplicationDbContext context) : EfRepository<Order>(context), IOrderRepository
{
    public async Task<int> CountAsync(OrderStatus? status)
    {
        if (status != null)
        {
            return await _context.Orders.CountAsync(x => x.Status == status);
        }
        return await _context.Orders.CountAsync();
    }

    public async Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions)
    {
        var query = _context.Orders.OrderByDescending(x => x.CreatedDate);
        return await ListResult<Order>.Success(query, filterOptions);
    }

    public async Task<IEnumerable<OrderDetail>> ListOrderDetails(Guid orderId) => await _context.OrderDetails.Where(x => x.OrderId == orderId).ToListAsync();

    public void RemoveRange(IEnumerable<OrderDetail> orderDetails) => _context.OrderDetails.RemoveRange(orderDetails);
}
