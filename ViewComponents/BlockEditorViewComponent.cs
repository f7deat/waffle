using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class BlockEditorViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public BlockEditorViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            if (string.IsNullOrEmpty(workContent?.Arguments))
            {
                return View(Empty.DefaultView);
            }
            var blockEditor = JsonSerializer.Deserialize<List<BlockEditorBlock>>(workContent.Arguments);
            return View(blockEditor);
        }
    }
}