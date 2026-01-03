using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Core.Interfaces.IService;
using Waffle.Core.IServices.Users;
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
    public async Task<IActionResult> SubmitContactAsync([FromBody] Contact args)
    {
        if (string.IsNullOrWhiteSpace(args.Email) || string.IsNullOrWhiteSpace(args.Name)) return BadRequest("Email and Name are required.");
        if (args.Email.Length > 100 || args.Name.Length > 100) return BadRequest("Email and Name must be less than 100 characters.");
        if (!string.IsNullOrWhiteSpace(args.PhoneNumber) && args.PhoneNumber.Length > 20) return BadRequest("Phone number must be less than 20 characters.");
        if (!string.IsNullOrWhiteSpace(args.Address) && args.Address.Length > 200) return BadRequest("Address must be less than 200 characters.");
        if (!string.IsNullOrWhiteSpace(args.Note) && args.Note.Length > 500) return BadRequest("Note must be less than 500 characters.");
        if (!string.IsNullOrWhiteSpace(args.Email) && !EmailHelper.IsValid(args.Email)) return BadRequest("Invalid email format.");
        return Ok(await _contactService.AddAsync(args));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id) => Ok(await _contactService.DeleteAsync(id));

    [HttpPost]
    public async Task<IActionResult> AddAsync([FromBody] Contact args) => Ok(await _contactService.AddAsync(args));
}
