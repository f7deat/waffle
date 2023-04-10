﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private readonly List<Order> Orders = new() { 
            new Order
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.Now,
                Status = OrderStatus.Open
            }
        };

        [HttpGet("list")]
        public IActionResult ListAsync(BasicFilterOptions filterOptions) => Ok(new
        {
            data = Orders
        });

        [HttpPost("add")]
        public IActionResult AddAsync([FromBody] Order args)
        {
            args.Id = Guid.NewGuid();
            Orders.Add(args);
            return Ok(IdentityResult.Success);
        }

        [HttpGet("{id}")]
        public IActionResult GetAsync([FromRoute] Guid id)
        {
            return Ok(Orders.FirstOrDefault(x => x.Id == id));
        }

        [HttpPost("delete/{id}")]
        public IActionResult DeleteAsync([FromRoute] Guid id)
        {
            var order = Orders.FirstOrDefault(x => x.Id == id);
            if (order == null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Order not found"
                }));
            }
            Orders.Remove(order);
            return Ok(IdentityResult.Success);
        }
    }
}