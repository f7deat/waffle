using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Core.Helpers;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers;

public class NewsletterController(ApplicationDbContext _context) : BaseController
{
    public sealed record SubscribeRequest(string? Email, string? Locale);

    [HttpPost("subscribe"), AllowAnonymous]
    public async Task<IActionResult> SubscribeAsync([FromBody] SubscribeRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || email.Length > 256 || !EmailHelper.IsValid(email))
            return BadRequest("Invalid email format.");

        var locale = string.IsNullOrWhiteSpace(request.Locale) || request.Locale.Length > 10 ? "vi-VN" : request.Locale;
        var exists = await _context.NewsletterSubscribers.AnyAsync(x => x.Email == email && x.Locale == locale, cancellationToken);
        if (!exists)
        {
            _context.NewsletterSubscribers.Add(new NewsletterSubscriber { Id = Guid.NewGuid(), Email = email, Locale = locale });
            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException)
            {
                // A concurrent request subscribed the same email; treat as success.
            }
        }

        var total = await _context.NewsletterSubscribers.CountAsync(x => x.Locale == locale, cancellationToken);
        return Ok(new { succeeded = true, total });
    }

    [HttpGet("count"), AllowAnonymous]
    public async Task<IActionResult> CountAsync([FromQuery] string locale, CancellationToken cancellationToken)
        => Ok(new { total = await _context.NewsletterSubscribers.CountAsync(x => x.Locale == locale, cancellationToken) });
}
