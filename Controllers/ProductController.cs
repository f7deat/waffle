﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Waffle.Models.ViewModels;

namespace Waffle.Controllers
{
    public class ProductController : BaseController
    {
        private readonly List<ProductItem> Products = new();

        [HttpGet("list")]
        public IActionResult List()
        {
            return Ok(new
            {
                data = Products
            });
        }

        [HttpPost("add")]
        public IActionResult AddAsync([FromBody] ProductItem args)
        {
            return Ok(IdentityResult.Success);
        }
    }
}
