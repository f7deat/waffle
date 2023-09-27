using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Ecommerces;
using Waffle.Models;

namespace Waffle.Controllers;

public class OrderController : BaseController
{
    private readonly IOrderService _orderService;
    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private readonly List<Order> Orders = new() { 
        new Order
        {
            Id = Guid.NewGuid(),
            CreatedDate = DateTime.Now,
            Status = OrderStatus.Open
        }
    };

    [HttpGet("list")]
    public async Task<IActionResult> ListAsync(BasicFilterOptions filterOptions) => Ok(await _orderService.ListAsync(filterOptions));

    [HttpPost("add")]
    public IActionResult AddAsync([FromBody] Order args)
    {
        args.Id = Guid.NewGuid();
        Orders.Add(args);
        return Ok(IdentityResult.Success);
    }

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
}
