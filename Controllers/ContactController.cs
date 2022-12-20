using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using SendGrid;
using Waffle.Data;
using Microsoft.EntityFrameworkCore;
using Waffle.Entities;
using System.Text.Json;
using Waffle.ExternalAPI.SendGrid;
using Microsoft.AspNetCore.Authorization;
using Waffle.Core.Services.Contacts.Models;
using Waffle.Models.Components;
using Microsoft.AspNetCore.Identity;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ContactController> _logger;
        public ContactController(ApplicationDbContext context, ILogger<ContactController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync()
        {
            return Ok(new
            {
                data = await _context.Contacts.ToListAsync(),
                total = await _context.Contacts.CountAsync()
            });
        }

        [HttpPost("submit-form"), AllowAnonymous]
        public async Task<IActionResult> SubmitContactAsync(SubmitFormModel model)
        {
            if (model is null)
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
                    var to = new EmailAddress(model.Email, model.Name);
                    var plainTextContent = "and easy to do anywhere, even with C#";
                    var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogError("Email sending error!", model.Email);
                    }
                }
            }
            var workContent = await _context.WorkContents.FindAsync(model.WorkContentId);
            if (workContent is null || string.IsNullOrEmpty(workContent.Arguments))
            {
                return Redirect("/");
            }
            var contact = new Contact
            {
                CreatedDate = DateTime.Now,
                Email = model.Email,
                Name = model.Name,
                Note = model.Note,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                Meta = JsonSerializer.Serialize(meta)
            };
            await _context.Contacts.AddAsync(contact);
            await _context.SaveChangesAsync();
            var contactForm = JsonSerializer.Deserialize<ContactForm>(workContent.Arguments);
            if (contactForm is null)
            {
                return NotFound("Missing configuration!");
            }
            return Redirect(contactForm?.ResultUrl ?? "/");
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null)
            {
                return Ok(IdentityResult.Failed(new IdentityError
                {
                    Description = "Contact not found!"
                }));
            }
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
    }
}
