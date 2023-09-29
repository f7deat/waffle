﻿using Microsoft.AspNetCore.Identity;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IOrderService
{
    Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions);
    Task<IdentityResult> AddAsync(Order order);
    Task<Order?> FindAsync(Guid id);
    Task DeleteAsync(Order order);
    Task<int> CountAsync();
    Task AddOrderDetailsAsync(List<OrderDetail> orderDetails);
}
