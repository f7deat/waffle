using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Core.Services
{
    public class OrderSerivce : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        public OrderSerivce(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IdentityResult> AddAsync(Order order)
        {
            order.Status = OrderStatus.Open;
            order.CreatedDate = DateTime.Now;
            await _orderRepository.AddAsync(order);
            return IdentityResult.Success;
        }

        public Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions)
        {
            throw new NotImplementedException();
        }
    }
}
