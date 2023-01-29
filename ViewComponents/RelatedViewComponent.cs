﻿using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class RelatedViewComponent : ViewComponent
    {
        private readonly ICatalogService _catalogService;
        public RelatedViewComponent(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        public async Task<IViewComponentResult> InvokeAsync(WorkItem item)
        {
            var articles = await _catalogService.ArticleRelatedListAsync(new ArticleRelatedFilterOption
            {
                CatalogId = item.CatalogId,
                PageSize = 4,
                WorkId = item.WorkContentId
            });
            if (articles?.Data == null || !articles.Data.Any())
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = item.WorkContentId.ToString()
                });
            }
            return View(articles.Data);
        }
    }
}