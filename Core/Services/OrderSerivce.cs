using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Core.Services;

public class OrderSerivce : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderDetailRepository _orderDetailRepository;
    private readonly ILogger<OrderSerivce> _logger;

    public OrderSerivce(IOrderRepository orderRepository, ILogger<OrderSerivce> logger, IOrderDetailRepository orderDetailRepository)
    {
        _orderRepository = orderRepository;
        _orderDetailRepository = orderDetailRepository;
        _logger = logger;
    }

    public async Task<IdentityResult> AddAsync(Order order)
    {
        order.Status = OrderStatus.Open;
        order.CreatedDate = DateTime.Now;
        await _orderRepository.AddAsync(order);
        return IdentityResult.Success;
    }

    public async Task AddOrderDetailsAsync(List<OrderDetail> orderDetails)
    {
        if (!orderDetails.Any())
        {
            _logger.LogError("No product was found!");
            return;
        }
        await _orderDetailRepository.AddRangeAsync(orderDetails);
    }

    public Task<int> CountAsync() => _orderRepository.CountAsync();

    public async Task DeleteAsync(Order order)
    {
        await _orderRepository.DeleteAsync(order);
        var orderDetails = await _orderRepository.ListOrderDetails(order.Id);
        await _orderRepository.RemoveRange(orderDetails);
    }

    public async Task<Order?> FindAsync(Guid id) => await _orderRepository.FindAsync(id);

    public async Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions) => await _orderRepository.ListAsync(filterOptions);
}
