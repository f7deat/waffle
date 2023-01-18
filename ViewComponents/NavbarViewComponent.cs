﻿using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class NavbarViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public NavbarViewComponent(IWorkService workService)
        {
            _workService = workService;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid worId)
        {
            var navbar = await _workService.GetAsync<Navbar>(worId);
            if (navbar is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = worId.ToString()
                });
            }
            if (navbar.Layout == Layout.Vertical)
            {
                return View(Layout.Vertical.ToString(), navbar);
            }
            return View(navbar);
        }
    }
}
