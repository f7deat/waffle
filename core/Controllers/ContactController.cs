﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.Services.Contacts.Models;
using Waffle.Data;
using Waffle.Entities;
using Waffle.Models;

namespace Waffle.Controllers;

public class ContactController(ApplicationDbContext _context, IUserService _userService, IContactService _contactService) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync([FromQuery] SearchFilterOptions filterOptions) => Ok(await _userService.ListContactAsync(filterOptions));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAsync([FromRoute] Guid id) => Ok(await _context.Contacts.FindAsync(id));

    [HttpPost("submit"), AllowAnonymous]
    public async Task<IActionResult> SubmitContactAsync(SubmitFormModel model)
    {
        if (model is null) return BadRequest();
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Name))
        {
            return BadRequest("Email and Name are required.");
        }
        if (model.Email.Length > 100 || model.Name.Length > 100)
        {
            return BadRequest("Email and Name must be less than 100 characters.");
        }
        if (!string.IsNullOrWhiteSpace(model.PhoneNumber) && model.PhoneNumber.Length > 20)
        {
            return BadRequest("Phone number must be less than 20 characters.");
        }
        if (!string.IsNullOrWhiteSpace(model.Address) && model.Address.Length > 200)
        {
            return BadRequest("Address must be less than 200 characters.");
        }
        if (!string.IsNullOrWhiteSpace(model.Note) && model.Note.Length > 500)
        {
            return BadRequest("Note must be less than 500 characters.");
        }
        if (!string.IsNullOrWhiteSpace(model.Email) && !EmailHelper.IsValid(model.Email))
        {
            return BadRequest("Invalid email format.");
        }
        var contact = new Contact
        {
            CreatedDate = DateTime.Now,
            Email = model.Email,
            Name = model.Name,
            Note = model.Note,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address
        };
        await _context.Contacts.AddAsync(contact);
        await _context.SaveChangesAsync();
        return Redirect("/contact/thank");
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _contactService.DeleteAsync(id));

    [HttpPost("add")]
    public async Task<IActionResult> AddAsync([FromBody] Contact args)
    {
        args.CreatedDate = DateTime.Now;
        await _context.Contacts.AddAsync(args);
        await _context.SaveChangesAsync();
        return Ok(args);
    }
}
