﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Constants;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ComponentController : Controller
    {
        private readonly IComponentService _componentService;
        public ComponentController(IComponentService componentService)
        {
            _componentService = componentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _componentService.FindAsync(id));

        [HttpGet("list-all")]
        public async Task<IActionResult> ListAllAsync() => Ok(await _componentService.ListAllAsync());

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await _componentService.ListAsync(filterOptions));

        [HttpGet("list-work/{id}")]
        public async Task<IActionResult> ListWorkAsync([FromRoute] Guid id, [FromQuery] WorkFilterOptions filterOptions) => Ok(await _componentService.ListWorkAsync(id, filterOptions));

        [HttpPost("delete/{id}"), Authorize(Roles = RoleName.Admin)]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _componentService.DeleteAsync(id));

        [HttpPost("active/{id}")]
        public async Task<IActionResult> ActiveAsync([FromRoute] Guid id) => Ok(await _componentService.ActiveAsync(id));

        [HttpPost("update")]
        public async Task<IActionResult> UpdateAsync([FromBody] Component args) => Ok(await _componentService.UpdateAsync(args));
    }
}
