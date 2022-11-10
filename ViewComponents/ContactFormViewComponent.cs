using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Waffle.Data;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ContactFormViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;
        public ContactFormViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var workContent = await _context.WorkContents.FindAsync(id);
            
            if (workContent == null || string.IsNullOrEmpty(workContent.Arguments))
            {
                return View();
            }

            return View(JsonSerializer.Deserialize<ContactForm>(workContent.Arguments));
        }
    }
}
