﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Entities.Ecommerces;
using Waffle.Extensions;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Models.Params.Products;

namespace Waffle.Controllers.Products;

public class OrderController(IOrderService _orderService, ITelegramService _telegramService, UserManager<ApplicationUser> _userManager) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync(BasicFilterOptions filterOptions) => Ok(await _orderService.ListAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _orderService.GetDetailsAsync(id));

    [HttpGet("count")]
    public async Task<IActionResult> CountByStatusAsync([FromQuery] OrderStatus? status) => Ok(await _orderService.CountByStatusAsync(status));

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
        if (args.OrderDetails.Count == 0) return BadRequest("Không tìm thấy sản phẩm trong giỏ hàng!");
        if (string.IsNullOrWhiteSpace(args.PhoneNumber)) return BadRequest("Phone number is required!");
        var userId = User.GetClaimId();
        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return BadRequest("User not found!");
            args.Name = user.Name;
            args.PhoneNumber = user.PhoneNumber;
            args.Address = user.Address;
        }
        else
        {
            var customer = await _userManager.FindByNameAsync(args.PhoneNumber);
            if (customer is null)
            {
                customer = new ApplicationUser
                {
                    UserName = args.PhoneNumber,
                    Address = args.Address,
                    PhoneNumber = args.PhoneNumber
                };
                var result = await _userManager.CreateAsync(customer);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(customer, RoleName.Customer);
                }
            }
        }
        var order = new Order
        {
            UserId = User.GetId(),
            CreatedDate = DateTime.Now,
            Note = args.Note
        };
        await _orderService.AddAsync(order);
        await _orderService.AddOrderDetailsAsync(order.Id, args.OrderDetails);
        await _telegramService.SendMessageAsync($"New order [{order.Number}]: \nName: {args.Name}\nPhone: {args.PhoneNumber}\nAddress: {args.Address}\nNote: {args.Note}");
        return Ok($"/{CatalogType.Product}/checkout/finish");
    }
}
