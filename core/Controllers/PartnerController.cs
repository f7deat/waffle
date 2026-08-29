using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waffle.Core.Foundations;
using Waffle.Data;
using Waffle.Entities;

namespace Waffle.Controllers;

public class PartnerController(ApplicationDbContext dbContext) : BaseController
{
    [HttpGet("list")]
    public async Task<IActionResult> ListAsync()
    {
        var data = await dbContext.Partners
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync();

        return Ok(new { data, total = data.Count, success = true });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAsync([FromBody] PartnerArgs args)
    {
        if (!TryValidate(args, out var error)) return BadRequest(error);

        var partner = new Partner
        {
            Name = args.Name.Trim(),
            Logo = args.Logo.Trim(),
            Url = args.Url.Trim(),
        };
        dbContext.Partners.Add(partner);
        await dbContext.SaveChangesAsync();

        return Ok(partner);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] Guid id, [FromBody] PartnerArgs args)
    {
        if (!TryValidate(args, out var error)) return BadRequest(error);

        var partner = await dbContext.Partners.FindAsync(id);
        if (partner is null) return NotFound();

        partner.Name = args.Name.Trim();
        partner.Logo = args.Logo.Trim();
        partner.Url = args.Url.Trim();
        await dbContext.SaveChangesAsync();

        return Ok(partner);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        var partner = await dbContext.Partners.FindAsync(id);
        if (partner is null) return NotFound();

        dbContext.Partners.Remove(partner);
        await dbContext.SaveChangesAsync();
        return Ok(new { succeeded = true });
    }

    private static bool TryValidate(PartnerArgs args, out string error)
    {
        if (string.IsNullOrWhiteSpace(args.Name) || string.IsNullOrWhiteSpace(args.Logo) || string.IsNullOrWhiteSpace(args.Url))
        {
            error = "Name, logo and URL are required";
            return false;
        }

        if (!Uri.TryCreate(args.Url, UriKind.Absolute, out var uri) || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        {
            error = "URL must be an absolute HTTP or HTTPS address";
            return false;
        }

        error = string.Empty;
        return true;
    }
}

public class PartnerArgs
{
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}