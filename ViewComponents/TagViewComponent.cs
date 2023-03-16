using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class TagViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        private readonly ICatalogService _catalogService;
        public TagViewComponent(IWorkService workService, ICatalogService catalogService)
        {
            _workService = workService;
            _catalogService = catalogService;

        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var tag = await _workService.GetAsync<Tag>(id);
            var catalogs = await _catalogService.ListAsync(new Models.CatalogFilterOptions
            {
                Active = true,
                Type = Entities.CatalogType.Tag
            });
            return View();
        }
    }
}
