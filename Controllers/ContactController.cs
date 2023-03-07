using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using SendGrid;
using Waffle.Data;
using Waffle.Entities;
using System.Text.Json;
using Waffle.ExternalAPI.SendGrid;
using Microsoft.AspNetCore.Authorization;
using Waffle.Core.Services.Contacts.Models;
using Waffle.Models.Components;
using Microsoft.AspNetCore.Identity;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Core.Services.AppSettings;
using Waffle.Models;

namespace Waffle.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ITelegramService _telegramService;
        private readonly ILogger<ContactController> _logger;
        private readonly IAppSettingService _appSettingService;
        public ContactController(ApplicationDbContext context, ILogger<ContactController> logger, ITelegramService telegramService, IAppSettingService appSettingService)
        {
            _context = context;
            _logger = logger;
            _telegramService = telegramService;
            _appSettingService = appSettingService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] BasicFilterOptions filterOptions) => Ok(await ListResult<Contact>.Success(_context.Contacts, filterOptions));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Contacts.FindAsync(id));

        [HttpPost("submit-form"), AllowAnonymous]
        public async Task<IActionResult> SubmitContactAsync(SubmitFormModel model)
        {
            if (model is null)
            {
                return BadRequest();
            }
            var meta = new ContactMeta();
            var config = await _appSettingService.GetAsync<SendGridConfigure>(nameof(SendGrid));
            if (config is not null)
            {
                var client = new SendGridClient(config.ApiKey);
                var from = new EmailAddress(config.From.Email, config.From.Name);
                var subject = "[DLiTi.Com.Au] Thank for register";
                var to = new EmailAddress(model.Email, model.Name);
                var plainTextContent = $"Hi {model.Name}";
                var htmlContent = "Thank for register, we will contact you asap!";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Email sending error!", model.Email);
                }
                subject = "[DLiTi.Com.Au] You have a new contact";
                to = new EmailAddress("dlititimberbuild@gmail.com", "Taan");
                plainTextContent = $"Hi there";
                htmlContent = "You have a new contact, Please go to https://crm.defzone.net to view details";
                msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Email sending error!");
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
            var telegram = await _appSettingService.GetAsync<Telegram>(nameof(Telegram));
            if (telegram != null)
            {
                await _telegramService.SendMessageAsync(telegram.Bot, contactForm.ChatId, $"You have new contact: {contact.Email}/{contact.PhoneNumber}/{contact.Address}/{contact.Note}");
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
