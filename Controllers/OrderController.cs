using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync(IFilterOptions filterOptions) => Ok(await _orderService.ListAsync(filterOptions));
    }
}
