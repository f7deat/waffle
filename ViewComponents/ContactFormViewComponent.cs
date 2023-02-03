using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Interfaces.IService;
using Waffle.Models;
using Waffle.Models.Components;

namespace Waffle.ViewComponents
{
    public class ContactFormViewComponent : ViewComponent
    {
        private readonly IWorkService _workService;
        public ContactFormViewComponent(IWorkService workService)
        {
            _workService = workService;
        }

        public async Task<IViewComponentResult> InvokeAsync(Guid id)
        {
            var contactForm = await _workService.GetAsync<ContactForm>(id);
            if (contactForm is null)
            {
                return View(Empty.DefaultView, new ErrorViewModel
                {
                    RequestId = id.ToString()
                });
            }
            contactForm.Id = id;
            return View(contactForm);
        }
    }
}
