using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
using Waffle.Models;
using Waffle.Models.Params.Products;

namespace Waffle.Controllers;

public class OrderController : BaseController
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync(BasicFilterOptions filterOptions) => Ok(await _orderService.ListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _orderService.FindAsync(id));

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var order = await _orderService.FindAsync(id);
        if (order is null) return BadRequest("Order not found!");
        await _orderService.DeleteAsync(order);
        return Ok(IdentityResult.Success);
    }

    [HttpPost("add"), AllowAnonymous]
    public async Task<IActionResult> AddAsync([FromBody] AddOrderRequest args)
    {
        var count = await _orderService.CountAsync();
        var order = new Order
        {
            UserId = User.GetId(),
            CreatedDate = DateTime.Now,
            Note = args.Note,
            Status = OrderStatus.Open,
            Number = $"{count + 1}"
        };
        await _orderService.AddAsync(order);
        await _orderService.AddOrderDetailsAsync(args.OrderDetails);
        return Ok(IdentityResult.Success);
    }
}
