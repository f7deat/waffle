using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Params.Products;

namespace Waffle.Controllers;

public class OrderController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly ITelegramService _telegramService;
    private readonly UserManager<ApplicationUser> _userManager;

    public OrderController(IOrderService orderService, ITelegramService telegramService, IUserService userService, UserManager<ApplicationUser> userManager)
    {
        _orderService = orderService;
        _telegramService = telegramService;
        _userManager = userManager;
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

    [HttpPost("place-order"), AllowAnonymous]
    public async Task<IActionResult> AddAsync([FromBody] AddOrderRequest args)
    {
        var count = await _orderService.CountAsync();
        var userId = User.GetId();
        if (User.GetId() != Guid.Empty)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user is null) return BadRequest("User not found!");
            args.Name = user.Name;
            args.PhoneNumber = user.PhoneNumber;
            args.Address = user.Address;
        }
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
        await _telegramService.SendMessageAsync($"New order recived: \nName: {args.Name}\nPhone: {args.PhoneNumber}\nAddress: {args.Address}\nNote: {args.Note}");
        return Ok("/products/checkout/finish");
    }
}
