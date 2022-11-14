using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using SendGrid;
using Waffle.Data;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Waffle.ExternalAPI.SendGrid;
using Microsoft.AspNetCore.Authorization;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("submit-form"), AllowAnonymous]
        public async Task<IActionResult> SubmitContactAsync(Contact contact)
        {
            if (contact is null)
            {
                return BadRequest();
            }
            var meta = new ContactMeta();
            var appSetting = await _context.AppSettings.FirstOrDefaultAsync(x => x.NormalizedName.Equals(nameof(SendGrid)));
            if (appSetting is not null && !string.IsNullOrEmpty(appSetting.Value))
            {
                var config = JsonSerializer.Deserialize<SendGridConfigure>(appSetting.Value);
                if (config is not null)
                {
                    var client = new SendGridClient(config.ApiKey);
                    var from = new EmailAddress(config.From.Email, config.From.Name);
                    var subject = "Sending with Twilio SendGrid is Fun";
                    var to = new EmailAddress(contact.Email, contact.Name);
                    var plainTextContent = "and easy to do anywhere, even with C#";
                    var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                }
            }
            var workContent = await _context.WorkContents.FindAsync();
            return Redirect("");
        }
    }
}
