﻿using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using Waffle.Data;
using Waffle.Entities;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Waffle.Core.Services.Contacts.Models;
using Waffle.Models.Components;
using Microsoft.AspNetCore.Identity;
using Waffle.ExternalAPI.Models;
using Waffle.ExternalAPI.Interfaces;
using Waffle.Models;
using Waffle.Core.Interfaces.IService;
using SendGrid;
using Waffle.Core.Foundations;

namespace Waffle.Controllers;

public class ContactController(ILogService _appLogService, ApplicationDbContext _context, ILogger<ContactController> _logger, ILogService _logService, ITelegramService _telegramService, ISettingService _appSettingService, IUserService _userService, IWorkService _workService, ICatalogService _catalogService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] SearchFilterOptions filterOptions) => Ok(await _userService.ListContactAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Contacts.FindAsync(id));

    [HttpPost("submit-form"), AllowAnonymous]
    public async Task<IActionResult> SubmitContactAsync(SubmitFormModel model)
    {
        if (model is null) return BadRequest();
        var meta = new ContactMeta();
        var config = await _appSettingService.GetAsync<ExternalAPI.SendGrids.SendGrid>(nameof(SendGrid));
        if (config != null)
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
                _logger.LogError("Sending to {Email} error!", model.Email);
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
        var contactForm = await _workService.GetAsync<ContactForm>(model.WorkId);
        if (contactForm is null) return BadRequest("Work not found!");
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
        var telegram = await _appSettingService.GetAsync<Telegram>(nameof(Telegram));
        if (telegram != null)
        {
            var chatId = contactForm.ChatId ?? telegram.ChatId;
            await _telegramService.SendMessageAsync(telegram.Token, chatId, $"{contactForm.Type}\nName: {contact.Name}\nEmail: {contact.Email}\nPhone: {contact.PhoneNumber}\nAddress: {contact.Address}\nNote: {contact.Note}");
        }
        var page = await _catalogService.FindAsync(contactForm.FinishPageId);
        if (page is null)
        {
            await _appLogService.AddAsync("Finish page not found!", contactForm.FinishPageId);
            return BadRequest("Finish page not found!");
        }
        return Redirect("/contact/thank");
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        try
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null) return BadRequest("Contact not found!");
            _context.Contacts.Remove(contact);
            await _appLogService.AddAsync($"Delete contact {contact.Name} - {contact.PhoneNumber} - {contact.Email}", id);
            await _context.SaveChangesAsync();
            return Ok(IdentityResult.Success);
        }
        catch (Exception ex)
        {
            await _logService.ExceptionAsync(ex);
            return BadRequest(ex.ToString());
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Contact args)
    {
        args.CreatedDate = DateTime.Now;
        await _context.Contacts.AddAsync(args);
        await _context.SaveChangesAsync();
        return Ok(args);
    }
}
