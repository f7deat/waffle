﻿using Microsoft.AspNetCore.Identity;
using Waffle.Core.Interfaces.IRepository;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Models;
using Waffle.Models.ViewModels.Orders;

namespace Waffle.Core.Services;

public class OrderSerivce : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderDetailRepository _orderDetailRepository;
    private readonly ILogger<OrderSerivce> _logger;
    private readonly UserManager<ApplicationUser> _userManager;

    public OrderSerivce(IOrderRepository orderRepository, ILogger<OrderSerivce> logger, IOrderDetailRepository orderDetailRepository, UserManager<ApplicationUser> userManager)
    {
        _orderRepository = orderRepository;
        _orderDetailRepository = orderDetailRepository;
        _logger = logger;
        _userManager = userManager;
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

    public Task<int> CountByStatusAsync(OrderStatus status) => _orderRepository.CountAsync(status);

    public async Task DeleteAsync(Order order)
    {
        await _orderRepository.DeleteAsync(order);
        var orderDetails = await _orderRepository.ListOrderDetails(order.Id);
        await _orderRepository.RemoveRange(orderDetails);
    }

    public async Task<OrderDetailViewModel?> FindAsync(Guid id)
    {
        var order = await _orderRepository.FindAsync(id);
        if (order is null) return default;
        var returnValue = new OrderDetailViewModel
        {
            Status = order.Status,
            CreatedDate = order.CreatedDate,
            Id = order.Id,
            ModifiedDate = order.ModifiedDate,
            Note = order.Note,
            Number = order.Number
        };
        var user = await _userManager.FindByIdAsync(order.UserId.ToString());
        if (user != null)
        {
            returnValue.CustomerName = user.Name;
        }
        returnValue.OrderDetails = _orderDetailRepository.ListByOrderAsync(order.Id);
        return returnValue;
    }

    public async Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions) => await _orderRepository.ListAsync(filterOptions);
}
