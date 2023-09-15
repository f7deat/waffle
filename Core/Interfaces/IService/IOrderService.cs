using Microsoft.AspNetCore.Identity;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Core.Interfaces.IService;

public interface IOrderService
{
    Task<ListResult<Order>> ListAsync(IFilterOptions filterOptions);
    Task<IdentityResult> AddAsync(Order order);
}
