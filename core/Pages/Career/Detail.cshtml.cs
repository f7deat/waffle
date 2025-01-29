using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Interfaces.IService;
using Waffle.Entities.Careers;
using Waffle.Models;

namespace Waffle.Pages.Career;

public class DetailModel(ICatalogService catalogService, IJobOpportunityService _jobOpportunityService) : DynamicPageModel(catalogService)
{
    public IEnumerable<ComponentListItem>? Components;
    public JobOpportunity? JobOpportunity { get; set; } = new();

    public async Task<IActionResult> OnGetAsync()
    {
        Components = await _catalogService.ListComponentAsync(PageData.Id);
        JobOpportunity = await _jobOpportunityService.GetAsync(PageData.Id);
        return Page();
    }
}
