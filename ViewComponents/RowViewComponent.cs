using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Interfaces.IService;
using Waffle.Data;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents;

public class RowViewComponent : ViewComponent
{
    private readonly IWorkService _workService;
    private readonly ApplicationDbContext _context;
    public RowViewComponent(IWorkService workService, ApplicationDbContext context)
    {
        _workService = workService;
        _context = context;
    }
    public async Task<IViewComponentResult> InvokeAsync(Guid id)
    {
        var row = await _workService.GetAsync<Row>(id);
        if (row is null)
        {
            return View(Empty.DefaultView, new ErrorViewModel
            {
                RequestId = id.ToString()
            });
        }
        row.Columns = await _context.WorkContents.Where(x => x.ParentId == id && x.Active).Select(x => x.Id).ToListAsync();
        return View(row);
    }
}
