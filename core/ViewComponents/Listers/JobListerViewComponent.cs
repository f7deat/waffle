using Waffle.Models;
using Waffle.Core.Foundations;
using Waffle.Models.Components.Lister;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities;

namespace Waffle.ViewComponents.Listers;

public class JobListerViewComponent(IWorkService workService, ICatalogService _catalogService) : BaseViewComponent<JobLister>(workService)
{
    protected override async Task<JobLister> ExtendAsync(JobLister work)
    {
        var current = string.IsNullOrEmpty(Request.Query["current"]) ? 1 : int.Parse(Request.Query["current"].ToString());
        var careers = await _catalogService.ListAsync(new CatalogFilterOptions
        {
            Active = true,
            Current = current,
            PageSize = 20,
            ParentId = PageData.Type == CatalogType.Entry ? null : PageData.Id,
            Type = CatalogType.Career,
            Name = Request.Query["searchTerm"],
            Locale = PageData.Locale
        });
        work.Catalogs = careers;
        return work;
    }
}
